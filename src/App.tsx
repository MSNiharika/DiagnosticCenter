import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ConsoleLayout } from "./components/ConsoleLayout"
import { SiteLayout } from "./components/SiteLayout"
import { StoreProvider } from "./context/Store"
import { About, Contact, Corporate, Doctors, NotFound, Platform, Prescription } from "./pages/More"
import { Booking } from "./pages/Booking"
import { CentreDetail } from "./pages/CentreDetail"
import { Centres } from "./pages/Centres"
import { Collection } from "./pages/Collection"
import { Home } from "./pages/Home"
import { Login } from "./pages/Login"
import { PackageDetail } from "./pages/PackageDetail"
import { Packages } from "./pages/Packages"
import { Reports } from "./pages/Reports"
import { TestDetail } from "./pages/TestDetail"
import { Tests } from "./pages/Tests"
import {
  BillingScreen,
  CommandScreen,
  DeskScreen,
  InsightsScreen,
  InventoryScreen,
  LogisticsScreen,
  PeopleScreen,
  QualityScreen,
  ReferralsScreen,
  SamplesScreen,
  ValidateScreen,
  WorklistScreen,
} from "./pages/console/Screens"

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<Home />} />
            <Route path="tests" element={<Tests />} />
            <Route path="tests/:id" element={<TestDetail />} />
            <Route path="imaging" element={<Tests preset="scan" />} />
            <Route path="packages" element={<Packages />} />
            <Route path="packages/:id" element={<PackageDetail />} />
            <Route path="book" element={<Booking />} />
            <Route path="collection" element={<Collection />} />
            <Route path="centres" element={<Centres />} />
            <Route path="centres/:id" element={<CentreDetail />} />
            <Route path="login" element={<Login />} />
            <Route path="reports" element={<Reports />} />
            <Route path="corporate" element={<Corporate />} />
            <Route path="prescription" element={<Prescription />} />
            <Route path="about" element={<About />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="contact" element={<Contact />} />
            <Route path="platform" element={<Platform />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="console" element={<ConsoleLayout />}>
            <Route index element={<CommandScreen />} />
            <Route path="desk" element={<DeskScreen />} />
            <Route path="samples" element={<SamplesScreen />} />
            <Route path="worklist" element={<WorklistScreen />} />
            <Route path="validate" element={<ValidateScreen />} />
            <Route path="billing" element={<BillingScreen />} />
            <Route path="inventory" element={<InventoryScreen />} />
            <Route path="logistics" element={<LogisticsScreen />} />
            <Route path="referrals" element={<ReferralsScreen />} />
            <Route path="quality" element={<QualityScreen />} />
            <Route path="people" element={<PeopleScreen />} />
            <Route path="insights" element={<InsightsScreen />} />
            <Route path="*" element={<CommandScreen />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}
