-- Allow Admins to update bookings (status, etc.)
create policy "Admins can update booking status"
  on bookings
  for update
  to authenticated
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Opcional: Permitir a usuarios cancelar sus reservas?
-- Por ahora solo admin.
