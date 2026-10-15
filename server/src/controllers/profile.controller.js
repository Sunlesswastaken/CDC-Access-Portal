export async function getOwnProfile(req, res) {
  // req.user was loaded from the database by requireAuth for the token's
  // owner only. There is no way to request another user's profile here.
  res.json({ user: req.user })
}
