import React, {useEffect, useRef, useState} from 'react';

const roman = n => n === 3 ? 'III' : 'V';
const rowKeys = ['department','hour','section','faculty_id','faculty_name','cdc_absent','department_absent','discrepancy'];
const headings = ['Department','Hour','Section','Faculty ID','Faculty name','CDC absentees','CDC students absent from Class','Discrepancy'];
const studentKeys = ['Batch Code','Branch','Roll Number','Student Name','Section','Hour','CDC Attendance','Class Attendance','Discrepancy'];
const queryKeys = ['Batch Code','Branch','Roll Number','CDC Attendance','Class Attendance','Missing Attendance'];
async function request(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    let detail; try {detail = (await response.json()).detail;} catch {}
    throw new Error(typeof detail === 'string' ? detail : 'Unable to read these files. Please check the format.');
  }
  return response;
}
const post = value => ({method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(value)});

function FileZone({title, description, accept, multiple=false, value, busy, onFiles, onRemove}) {
  const input = useRef();
  const [drag, setDrag] = useState(false);
  return <section className={'campus-upload ' + (drag ? 'dragging' : '')} onDragOver={e=>{e.preventDefault();if (!busy) setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);if (!busy) onFiles([...e.dataTransfer.files]);}}>
    <div className="upload-label"><span className="file-symbol">{multiple ? '▦' : '▤'}</span><div><h3>{title}</h3><p>{description}</p></div></div>
    <input ref={input} type="file" aria-label={title} accept={accept} multiple={multiple} disabled={busy} onChange={e=>{onFiles([...e.target.files]);e.target.value='';}}/>
    {multiple && <p role="status">{value.length} / 20 class files selected</p>}
    {value.length > 0 ? <div className="selected-files">{value.map(({file,info},i)=><div key={i}><b>{file.name}</b><span>{multiple ? `${info.records} activity records · ${info.dates.join(', ')} · semester ${info.semesters.map(roman).join(', ')}` : `${info.date} · ${info.session} · semester ${roman(info.semester)} · ${info.absentee_count} absentees`}</span>{multiple && <button className="secondary" disabled={busy} aria-label={'Remove '+file.name} onClick={()=>onRemove(i)}>Remove</button>}</div>)}</div> : <p className="drop-hint">Drop {multiple ? 'class files (up to 20)' : 'your CDC file'} here</p>}
    <button className="secondary" disabled={busy || (multiple && value.length>=20)} onClick={()=>input.current.click()}>{multiple ? (value.length ? 'Add more class files' : 'Choose class files') : (value.length ? 'Change CDC file' : 'Choose CDC file')}</button>
  </section>;
}

export default function CollegeApp() {
  const [database,setDatabase] = useState(null), [cdc,setCdc] = useState([]), [classes,setClasses] = useState([]);
  const [day,setDay] = useState(''), [busy,setBusy] = useState(false), [error,setError] = useState(''), [databaseError,setDatabaseError] = useState(false);
  const [result,setResult] = useState(null), [department,setDepartment] = useState(''), [hour,setHour] = useState('');
  const [saving,setSaving] = useState(''), [notice,setNotice] = useState('');
  const [question,setQuestion] = useState(''), [answer,setAnswer] = useState(''), [asking,setAsking] = useState(false);
  const [studentFilter,setStudentFilter] = useState({batch:'',branch:'',missing:'All'}), [studentPage,setStudentPage] = useState(0);
  const [aiAvailable,setAiAvailable] = useState(false), [useAi,setUseAi] = useState(false);
  useEffect(()=>{request('/api/college/database').then(r=>r.json()).then(setDatabase).catch(e=>{setDatabaseError(true);setError(e.message);});fetch('/api/health').then(r=>r.json()).then(r=>setAiAvailable(r.ai_enabled)).catch(()=>{});},[]);
  async function load(files, kind) {
    if (!files.length || busy) return;
    setBusy(true);setError('');setResult(null);setNotice('');setAnswer('');
    const isCdc = kind === 'cdc';
    try {
      if (files.length + (isCdc ? 0 : classes.length) > (isCdc ? 1 : 20)) throw new Error(isCdc ? 'Choose one CDC file.' : 'You can add up to 20 class files in total. Remove a file before adding more.');
      const values = await Promise.all(files.map(async file=>{
        if (!/\.(xlsx|xls|csv|pdf)$/i.test(file.name) || file.size > 10*1024*1024) throw new Error('Choose PDF, XLSX, XLS or CSV. Maximum 10 MB per file.');
        const form = new FormData();form.append('file',file);
        const info = await (await request('/api/college/inspect-' + kind,{method:'POST',body:form})).json();
        return {file,info};
      }));
      if (isCdc) {setCdc(values);setDay(values[0].info.date);} else setClasses(previous=>[...previous,...values]);
    } catch(e) {setError(e.message);} finally {setBusy(false);}
  }
  const meta = cdc[0]?.info;
  const mismatch = meta && classes.length && !classes.every(v=>v.info.dates.includes(day) && v.info.semesters.includes(meta.semester));
  async function compare() {
    setBusy(true);setError('');setResult(null);setAnswer('');setNotice('');
    try {
      const form = new FormData();form.append('cdc',cdc[0].file);classes.forEach(v=>form.append('classroom',v.file));form.append('report_date',day);
      setResult(await (await request('/api/college/compare',{method:'POST',body:form})).json());
      setDepartment('');setHour('');setStudentFilter({batch:'',branch:'',missing:'All'});setStudentPage(0);
    } catch(e) {setError(e.message);} finally {setBusy(false);}
  }
  const rows = result?.rows.filter(r=>(!department || r.department===department) && (!hour || r.hour===Number(hour))) || [];
  const details = result?.details.filter(r=>(!department || r.Branch===department) && (!hour || r.Hour===Number(hour))) || [];
  const students = details.filter(r=>(!studentFilter.batch || r['Batch Code']===studentFilter.batch) && (!studentFilter.branch || r.Branch===studentFilter.branch) && (studentFilter.missing==='All' || r['Missing Attendance']===studentFilter.missing || (studentFilter.missing==='Discrepancies' && r.Discrepancy==='Yes')));
  async function download(format) {
    setSaving(format);setError('');setNotice('');
    try {
      const response = await request('/api/college/export?format='+format,post({report_id:result.report_id,branch:department,hour:Number(hour)}));
      const blob = await response.blob();
      const filename = response.headers.get('Content-Disposition')?.match(/filename="([^"]+)"/)?.[1] || 'attendance-report.'+format;
      const url=URL.createObjectURL(blob), a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setNotice('Download ready.');
    } catch(e) {setError(e.message);} finally {setSaving('');}
  }
  async function ask(e) {
    e.preventDefault();setAsking(true);setAnswer('');
    try {
      const rows = result.details.map(r=>Object.fromEntries(queryKeys.map(k=>[k,r[k]])));
      const response = await (await request('/api/query',post({question:question.replace(/discrepanc(?:y|ies)/gi,'present in CDC and absent in class'),rows,notes:[],use_ai:useAi}))).json();
      setStudentFilter({...response.filters,missing:response.filters.missing==='Class'?'Discrepancies':response.filters.missing});setStudentPage(0);
      setAnswer(response.answer.replace('matching students','matching student/hour records') + ' Each uploaded class hour is counted separately.');
    } catch(e) {setAnswer(e.message);} finally {setAsking(false);}
  }
  return <><header className="topbar"><div className="brand"><img className="brand-icon" src="/cdc-logo.png" alt="IARE"/>Attendance Studio</div><span className="mode-tag">College reports</span></header>
    <main className="campus-main">
      <div className="campus-heading"><div><h1>Attendance reconciliation</h1><p>Upload CDC attendance and department activity records for the same day.</p></div><span className="database-chip">{database ? `${database.cdc_students.toLocaleString()} CDC students loaded` : databaseError ? 'Student database unavailable' : 'Loading nominal rolls…'}</span></div>
      <div className="campus-inputs"><FileZone title="CDC attendance" description="PDF, Excel or CSV · one FN or AN session" accept=".pdf,.xlsx,.xls,.csv" value={cdc} busy={busy} onFiles={f=>load(f,'cdc')}/><FileZone title="Class activity records" description="PDF, Excel or CSV · add up to 20 files" accept=".pdf,.xlsx,.xls,.csv" multiple value={classes} busy={busy} onFiles={f=>load(f,'class')} onRemove={i=>{setClasses(previous=>previous.filter((_,n)=>n!==i));setResult(null);setError('');}}/></div>
      <section className="report-controls"><label>Report date<input type="date" value={day} disabled={busy} onChange={e=>{setDay(e.target.value);setResult(null);}}/></label><div><span className="field-label">Session & semester</span><strong>{meta ? `${meta.session} · B.Tech ${roman(meta.semester)} semester` : 'Detected from CDC file'}</strong></div><button className="primary" disabled={busy||!cdc.length||!classes.length||!day||!database} onClick={compare}>{busy ? 'Reading attendance…' : 'Compare & generate report →'}</button></section>
      {mismatch ? <div className="campus-warning" role="status">These files have different dates or semesters. Upload matching records to generate an accurate report.</div> : null}
      {error&&<div className="error" role="alert">{error}</div>}{notice&&<p role="status" className="save-notice">{notice}</p>}
      {result&&<div className="campus-results">
        <div className="campus-heading"><div><h2>B.Tech {roman(result.semester)} semester · {result.session} session</h2><p>{result.date} · {rows.length} class activity records</p></div><div className="download-actions"><button disabled={!!saving||!rows.length} onClick={()=>download('xlsx')}>{saving==='xlsx' ? 'Saving…' : '↓ Download Excel'}</button><button className="primary" disabled={!!saving||!rows.length} onClick={()=>download('pdf')}>{saving==='pdf' ? 'Saving…' : '↓ Download PDF'}</button></div></div>
        <div className="campus-counts">{[['Students represented',new Set(details.map(r=>r['Roll Number'])).size],['CDC absent records',rows.reduce((n,r)=>n+r.cdc_absent,0)],['Class absent records',rows.reduce((n,r)=>n+r.department_absent,0)],['Discrepancies',rows.reduce((n,r)=>n+r.discrepancy,0)]].map(([label,count])=><div key={label}><span>{label}</span><strong>{count}</strong></div>)}</div>
        <section className="campus-table-panel"><div className="campus-filters"><h3>Department report</h3><label>Branch<select aria-label="Branch" value={department} onChange={e=>{setDepartment(e.target.value);setStudentPage(0);}}><option value="">All branches</option>{[...new Set(result.rows.map(r=>r.department))].sort().map(v=><option key={v}>{v}</option>)}</select></label><label>Hour<select aria-label="Hour" value={hour} onChange={e=>{setHour(e.target.value);setStudentPage(0);}}><option value="">All hours</option>{[...new Set(result.rows.map(r=>r.hour))].sort().map(v=><option key={v}>{v}</option>)}</select></label></div><div className="table-scroll"><table><thead><tr>{headings.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={i}>{rowKeys.map(k=><td className={k==='discrepancy'?'difference':''} key={k}>{r[k]}</td>)}</tr>)}</tbody></table></div></section>
        <section className="campus-table-panel"><h3>Student attendance</h3><form className="campus-query" onSubmit={ask}><label htmlFor="college-query">Ask your attendance</label><div><input id="college-query" value={question} maxLength={600} onChange={e=>setQuestion(e.target.value)} placeholder="e.g. Show AIML students who missed class"/><button className="primary" disabled={asking||!question.trim()}>{asking?'Checking…':'Ask assistant'}</button></div><label className="checkbox"><input type="checkbox" checked={useAi} disabled={!aiAvailable||asking} onChange={e=>setUseAi(e.target.checked)}/>Use AI interpretation {aiAvailable?'':'(optional server setup required)'}</label><small>{useAi?'Your question and group labels are sent to OpenAI; student rows stay local.':'Built-in language filters work offline.'}</small></form>{answer&&<p className="answer" role="status">{answer}</p>}
        <div className="campus-filters"><label>Batch<select aria-label="Batch" value={studentFilter.batch} onChange={e=>{setStudentFilter({...studentFilter,batch:e.target.value});setStudentPage(0);}}><option value="">All batches</option>{[...new Set(details.map(r=>r['Batch Code']))].sort().map(b=><option key={b}>{b}</option>)}</select></label><label>Missing attendance<select aria-label="Missing attendance" value={studentFilter.missing} onChange={e=>{setStudentFilter({...studentFilter,missing:e.target.value});setStudentPage(0);}}>{['All','None','Discrepancies'].map(value=><option key={value}>{value}</option>)}</select></label><button onClick={()=>{setStudentFilter({batch:'',branch:'',missing:'All'});setStudentPage(0);setAnswer('');}}>Reset student filters</button><span>{students.length} student/hour records</span></div>
        <div className="table-scroll"><table><thead><tr>{studentKeys.map(k=><th key={k}>{k}</th>)}</tr></thead><tbody>{students.slice(studentPage*25,(studentPage+1)*25).map((r,i)=><tr key={i}>{studentKeys.map(k=><td key={k}>{k==='Discrepancy'?<span className={'status status-'+r[k].toLowerCase()}>{r[k]}</span>:r[k]}</td>)}</tr>)}</tbody></table></div><div className="pagination"><span>Page {studentPage+1} of {Math.max(1,Math.ceil(students.length/25))}</span><button disabled={!studentPage} onClick={()=>setStudentPage(studentPage-1)}>← Previous</button><button disabled={(studentPage+1)*25>=students.length} onClick={()=>setStudentPage(studentPage+1)}>Next →</button></div><p className="report-caption">Student filters affect this view. Excel includes the complete student ledger for the selected branch and hour.</p></section>
      </div>}
      <footer>Files are processed by the Attendance Studio server. Reports are temporarily held in server memory.</footer>
    </main></>;
}
