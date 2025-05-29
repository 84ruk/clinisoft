// src/app/logout/page.js
import { redirect } from 'next/navigation'

export default function LogoutPage() {
  redirect('/api/logout') // lo manda a la route handler que borra la cookie
}
