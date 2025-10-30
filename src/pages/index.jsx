import Layout from "./Layout.jsx";

import Home from "./Home";

import UserDashboard from "./UserDashboard";

import DriverDashboard from "./DriverDashboard";

import DriverRegister from "./DriverRegister";

import CorporateDashboard from "./CorporateDashboard";

import HotelDashboard from "./HotelDashboard";

import DispatcherDashboard from "./DispatcherDashboard";

import Wallet from "./Wallet";

import Support from "./Support";

import CorporateRegister from "./CorporateRegister";

import HotelRegister from "./HotelRegister";

import Profile from "./Profile";

import CompleteVerification from "./CompleteVerification";

import AdminPanel from "./AdminPanel";

import BlogEditor from "./BlogEditor";

import EventEditor from "./EventEditor";

import PageEditor from "./PageEditor";

import Blog from "./Blog";

import BlogPost from "./BlogPost";

import Events from "./Events";

import Event from "./Event";

import Page from "./Page";

import PassengerAuth from "./PassengerAuth";

import RideHistory from "./RideHistory";

import RideDetail from "./RideDetail";

import TrackRide from "./TrackRide";

import PaymentMethods from "./PaymentMethods";

import TransactionHistory from "./TransactionHistory";

import NotificationSettings from "./NotificationSettings";

import DriverVerification from "./DriverVerification";

import DriverEarnings from "./DriverEarnings";

import DriverPayments from "./DriverPayments";

import VehicleManagement from "./VehicleManagement";

import VehicleDocuments from "./VehicleDocuments";

import Register from "./Register";

import VerificationPending from "./VerificationPending";

import PartnerRegister from "./PartnerRegister";

import PartnerDashboard from "./PartnerDashboard";

import PartnerProviders from "./PartnerProviders";

import PartnerVehicles from "./PartnerVehicles";

import PartnerEarnings from "./PartnerEarnings";

import PartnerProfile from "./PartnerProfile";

import PartnerBankDetails from "./PartnerBankDetails";

import PartnerWallet from "./PartnerWallet";

import PartnerReferrals from "./PartnerReferrals";

import ProviderManagement from "./ProviderManagement";

import TripManagement from "./TripManagement";

import AdminSettings from "./AdminSettings";

import AdminCountries from "./AdminCountries";

import AdminCities from "./AdminCities";

import AdminServiceTypes from "./AdminServiceTypes";

import AdminPricingConfiguration from "./AdminPricingConfiguration";

import AdminZoneManagement from "./AdminZoneManagement";

import AdminZonePricing from "./AdminZonePricing";

import AdminCarRentalPackages from "./AdminCarRentalPackages";

import AdminPromoCodes from "./AdminPromoCodes";

import AdminReferrals from "./AdminReferrals";

import PWASetup from "./PWASetup";

import BusinessPlan from "./BusinessPlan";

import TestAuth from "./TestAuth";

import CarRental from "./CarRental";

import DispatcherLogin from "./DispatcherLogin";

import Admin from "./Admin";

import ForgotPassword from "./ForgotPassword";

import ResetPassword from "./ResetPassword";

import UniversalLogin from "./UniversalLogin";

import UniversalSignUp from "./UniversalSignUp";

import MigrationHub from "./MigrationHub";

import RepositoryReadme from "./RepositoryReadme";

import GoogleCallback from "./GoogleCallback";

import BackendDashboardLogin from "./BackendDashboardLogin";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    UserDashboard: UserDashboard,
    
    DriverDashboard: DriverDashboard,
    
    DriverRegister: DriverRegister,
    
    CorporateDashboard: CorporateDashboard,
    
    HotelDashboard: HotelDashboard,
    
    DispatcherDashboard: DispatcherDashboard,
    
    Wallet: Wallet,
    
    Support: Support,
    
    CorporateRegister: CorporateRegister,
    
    HotelRegister: HotelRegister,
    
    Profile: Profile,
    
    CompleteVerification: CompleteVerification,
    
    AdminPanel: AdminPanel,
    
    BlogEditor: BlogEditor,
    
    EventEditor: EventEditor,
    
    PageEditor: PageEditor,
    
    Blog: Blog,
    
    BlogPost: BlogPost,
    
    Events: Events,
    
    Event: Event,
    
    Page: Page,
    
    PassengerAuth: PassengerAuth,
    
    RideHistory: RideHistory,
    
    RideDetail: RideDetail,
    
    TrackRide: TrackRide,
    
    PaymentMethods: PaymentMethods,
    
    TransactionHistory: TransactionHistory,
    
    NotificationSettings: NotificationSettings,
    
    DriverVerification: DriverVerification,
    
    DriverEarnings: DriverEarnings,
    
    DriverPayments: DriverPayments,
    
    VehicleManagement: VehicleManagement,
    
    VehicleDocuments: VehicleDocuments,
    
    Register: Register,
    
    VerificationPending: VerificationPending,
    
    PartnerRegister: PartnerRegister,
    
    PartnerDashboard: PartnerDashboard,
    
    PartnerProviders: PartnerProviders,
    
    PartnerVehicles: PartnerVehicles,
    
    PartnerEarnings: PartnerEarnings,
    
    PartnerProfile: PartnerProfile,
    
    PartnerBankDetails: PartnerBankDetails,
    
    PartnerWallet: PartnerWallet,
    
    PartnerReferrals: PartnerReferrals,
    
    ProviderManagement: ProviderManagement,
    
    TripManagement: TripManagement,
    
    AdminSettings: AdminSettings,
    
    AdminCountries: AdminCountries,
    
    AdminCities: AdminCities,
    
    AdminServiceTypes: AdminServiceTypes,
    
    AdminPricingConfiguration: AdminPricingConfiguration,
    
    AdminZoneManagement: AdminZoneManagement,
    
    AdminZonePricing: AdminZonePricing,
    
    AdminCarRentalPackages: AdminCarRentalPackages,
    
    AdminPromoCodes: AdminPromoCodes,
    
    AdminReferrals: AdminReferrals,
    
    PWASetup: PWASetup,
    
    BusinessPlan: BusinessPlan,
    
    TestAuth: TestAuth,
    
    CarRental: CarRental,
    
    DispatcherLogin: DispatcherLogin,
    
    Admin: Admin,
    
    ForgotPassword: ForgotPassword,
    
    ResetPassword: ResetPassword,
    
    UniversalLogin: UniversalLogin,
    
    UniversalSignUp: UniversalSignUp,
    
    MigrationHub: MigrationHub,
    
    RepositoryReadme: RepositoryReadme,
    
    BackendDashboardLogin: BackendDashboardLogin,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/UserDashboard" element={<UserDashboard />} />
                
                <Route path="/DriverDashboard" element={<DriverDashboard />} />
                
                <Route path="/DriverRegister" element={<DriverRegister />} />
                
                <Route path="/CorporateDashboard" element={<CorporateDashboard />} />
                
                <Route path="/HotelDashboard" element={<HotelDashboard />} />
                
                <Route path="/DispatcherDashboard" element={<DispatcherDashboard />} />
                
                <Route path="/Wallet" element={<Wallet />} />
                
                <Route path="/Support" element={<Support />} />
                
                <Route path="/CorporateRegister" element={<CorporateRegister />} />
                
                <Route path="/HotelRegister" element={<HotelRegister />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/CompleteVerification" element={<CompleteVerification />} />
                
                <Route path="/AdminPanel" element={<AdminPanel />} />
                
                <Route path="/BlogEditor" element={<BlogEditor />} />
                
                <Route path="/EventEditor" element={<EventEditor />} />
                
                <Route path="/PageEditor" element={<PageEditor />} />
                
                <Route path="/Blog" element={<Blog />} />
                
                <Route path="/BlogPost" element={<BlogPost />} />
                
                <Route path="/Events" element={<Events />} />
                
                <Route path="/Event" element={<Event />} />
                
                <Route path="/Page" element={<Page />} />
                
                <Route path="/PassengerAuth" element={<PassengerAuth />} />
                
                <Route path="/RideHistory" element={<RideHistory />} />
                
                <Route path="/RideDetail" element={<RideDetail />} />
                
                <Route path="/TrackRide" element={<TrackRide />} />
                
                <Route path="/PaymentMethods" element={<PaymentMethods />} />
                
                <Route path="/TransactionHistory" element={<TransactionHistory />} />
                
                <Route path="/NotificationSettings" element={<NotificationSettings />} />
                
                <Route path="/DriverVerification" element={<DriverVerification />} />
                
                <Route path="/DriverEarnings" element={<DriverEarnings />} />
                
                <Route path="/DriverPayments" element={<DriverPayments />} />
                
                <Route path="/VehicleManagement" element={<VehicleManagement />} />
                
                <Route path="/VehicleDocuments" element={<VehicleDocuments />} />
                
                <Route path="/Register" element={<Register />} />
                
                <Route path="/VerificationPending" element={<VerificationPending />} />
                
                <Route path="/PartnerRegister" element={<PartnerRegister />} />
                
                <Route path="/PartnerDashboard" element={<PartnerDashboard />} />
                
                <Route path="/PartnerProviders" element={<PartnerProviders />} />
                
                <Route path="/PartnerVehicles" element={<PartnerVehicles />} />
                
                <Route path="/PartnerEarnings" element={<PartnerEarnings />} />
                
                <Route path="/PartnerProfile" element={<PartnerProfile />} />
                
                <Route path="/PartnerBankDetails" element={<PartnerBankDetails />} />
                
                <Route path="/PartnerWallet" element={<PartnerWallet />} />
                
                <Route path="/PartnerReferrals" element={<PartnerReferrals />} />
                
                <Route path="/ProviderManagement" element={<ProviderManagement />} />
                
                <Route path="/TripManagement" element={<TripManagement />} />
                
                <Route path="/AdminSettings" element={<AdminSettings />} />
                
                <Route path="/AdminCountries" element={<AdminCountries />} />
                
                <Route path="/AdminCities" element={<AdminCities />} />
                
                <Route path="/AdminServiceTypes" element={<AdminServiceTypes />} />
                
                <Route path="/AdminPricingConfiguration" element={<AdminPricingConfiguration />} />
                
                <Route path="/AdminZoneManagement" element={<AdminZoneManagement />} />
                
                <Route path="/AdminZonePricing" element={<AdminZonePricing />} />
                
                <Route path="/AdminCarRentalPackages" element={<AdminCarRentalPackages />} />
                
                <Route path="/AdminPromoCodes" element={<AdminPromoCodes />} />
                
                <Route path="/AdminReferrals" element={<AdminReferrals />} />
                
                <Route path="/PWASetup" element={<PWASetup />} />
                
                <Route path="/BusinessPlan" element={<BusinessPlan />} />
                
                <Route path="/TestAuth" element={<TestAuth />} />
                
                <Route path="/CarRental" element={<CarRental />} />
                
                <Route path="/DispatcherLogin" element={<DispatcherLogin />} />
                
                <Route path="/Admin" element={<Admin />} />
                
                <Route path="/ForgotPassword" element={<ForgotPassword />} />
                
                <Route path="/ResetPassword" element={<ResetPassword />} />
                
                <Route path="/UniversalLogin" element={<UniversalLogin />} />
                
                <Route path="/UniversalSignUp" element={<UniversalSignUp />} />
                
                <Route path="/MigrationHub" element={<MigrationHub />} />
                
                <Route path="/RepositoryReadme" element={<RepositoryReadme />} />
                
                <Route path="/auth/google/callback" element={<GoogleCallback />} />
                
                <Route path="/GoogleCallback" element={<GoogleCallback />} />
                
                <Route path="/BackendDashboard" element={<BackendDashboardLogin />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}