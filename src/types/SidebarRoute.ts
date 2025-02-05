type SidebarRoute = {
  to: string,
  icon: string,
  label: string,
}

export default SidebarRoute;

[
  { to: '/admin/books', icon: 'library_books', label: 'Kitaplar' },
  { to: '/admin/genres', icon: 'category', label: 'Kitap Türleri' },
  { to: '/admin/users', icon: 'group', label: 'Kullanıcılar' },
  {
    to: '/admin/borrowedbooks',
    icon: 'menu_book',
    label: 'Ödünç Kitaplar'
  },
  { to: '/admin/authors', icon: 'person_edit', label: 'Yazarlar' }
]