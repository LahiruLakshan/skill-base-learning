import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  createRoutesFromElements,
  Route,
  ScrollRestoration,
} from "react-router-dom";
import Footer from "./components/home/Footer/Footer";
import FooterBottom from "./components/home/Footer/FooterBottom";
import Header from "./components/home/Header/Header";
import HeaderBottom from "./components/home/Header/HeaderBottom";
import SpecialCase from "./components/SpecialCase/SpecialCase";
import About from "./pages/About/About";
import SignIn from "./pages/Account/SignIn";
import SignUp from "./pages/Account/SignUp";
import Cart from "./pages/Cart/Cart";
import Contact from "./pages/Contact/Contact";
import Home from "./pages/Home/Home";
import Journal from "./pages/Journal/Journal";
import Offer from "./pages/Offer/Offer";
import Payment from "./pages/payment/Payment";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import QuizComponent from "./pages/QuizComponent/QuizComponent";
import ModulesPage from "./pages/ModulesPage/ModulesPage";
import { SubModulesPage } from "./pages/SubModulesPage/SubModulesPage";
import ModuleContentPage from "./pages/ModuleContentPage/ModuleContentPage";
import ModuleQuiz from "./pages/ModuleQuiz/ModuleQuiz";
import UserDashboard from "./pages/UserDashboard/UserDashboard";
import Profile from "./pages/Profile/Profile";
import PracticeQuiz from "./pages/PracticeQuiz/PracticeQuiz";

const Layout = () => {
  return (
    <div>
      <Header />
      {/* <HeaderBottom /> */}
      <SpecialCase />
      <ScrollRestoration />
      <Outlet />
      <Footer />
      <FooterBottom />
    </div>
  );
};
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Layout />}>
        {/* ==================== Header Navlink Start here =================== */}
        <Route path="/" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/journal" element={<Journal />}></Route>
        {/* ==================== Header Navlink End here ===================== */}
        <Route path="/offer" element={<Offer />}></Route>
        <Route path="/product/:_id" element={<ProductDetails />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/paymentgateway" element={<Payment />}></Route>
        <Route path="/modules" element={<ModulesPage />}></Route>
        <Route path="/modules/:id" element={<SubModulesPage />}></Route>
        <Route path="/sub-module/:id" element={<ModuleContentPage />}></Route>
        <Route path="/pre-quiz" element={<QuizComponent />}></Route>
        <Route path="/practice-quiz" element={<PracticeQuiz />}></Route>
        <Route path="/quiz/:id" element={<ModuleQuiz />}></Route>
        <Route path="/dashboard" element={<UserDashboard />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
      </Route>
      <Route path="/signup" element={<SignUp />}></Route>
      <Route path="/signin" element={<SignIn />}></Route>
    </Route>
  )
);

function App() {
  return (
    <div className="font-bodyFont">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
