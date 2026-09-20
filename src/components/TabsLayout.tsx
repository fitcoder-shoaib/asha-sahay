import { Outlet } from 'react-router-dom'
import TabBar from './TabBar'

export default function TabsLayout() {
  return (
    <div className="screen">
      <Outlet />
      <TabBar />
    </div>
  )
}
