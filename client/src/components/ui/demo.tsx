import { Component } from '@/components/ui/3d-button'

export default function DemoOne() {
  return (
    <div className="flex min-h-[320px] items-center justify-center bg-white p-10">
      <div className="w-full max-w-[340px]">
        <Component className="w-full" label="Join Today" hoverLabel="Join Now" />
      </div>
    </div>
  )
}
