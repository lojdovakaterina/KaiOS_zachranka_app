import Home from "../routes/Home.svelte";
import Test from "../routes/testmode/Test.svelte";
import Profile from "../routes/Profile.svelte";
import HealthInformation from "../routes/HealthInformation.svelte";
import TemporaryInformation from "../routes/TemporaryInformation.svelte";
import PersonalInformation from "../routes/PersonalInformation.svelte";
import ContactList from "../routes/contact/ContactList.svelte";
import ContactDetail from "../routes/contact/ContactDetail.svelte";
import ConfirmCreateIncident from "../routes/incident/ConfirmCreateIncident.svelte";
import CallService from "../routes/incident/CreateIncident.svelte";
import TestCallService from "../routes/testmode/TestCallService.svelte";
import TestConfirmCreateIncident from "../routes/testmode/TestConfirmCreateIncident.svelte";
import TestResultScreen from "../routes/testmode/TestResultScreen.svelte";
import AddContactFromContactList from "../routes/contact/AddContactFromContactList.svelte";
import InitOnboarding from "../routes/onboarding/InitOnboarding.svelte";
import RegisterUser from "../routes/onboarding/RegisterUser.svelte";
import Permissions from "../routes/onboarding/Permissions.svelte";

export const routes = {
  "/": Home,
  "/onboarding/init": InitOnboarding,
  "/onboarding/registerUser": RegisterUser,
  "/onboarding/permissions": Permissions,
  "/home": Home,
  "/incident/confirm": ConfirmCreateIncident,
  "/incident/create": CallService,
  "/profile": Profile,
  "/profile/health": HealthInformation,
  "/profile/temporary": TemporaryInformation,
  "/profile/personal": PersonalInformation,
  "/profile/contacts": ContactList,
  "/profile/contacts/detail/:index/:contact": ContactDetail,
  "/profile/contacts/addContactList": AddContactFromContactList,
  "/test": Test,
  "/test/create": TestCallService,
  "/test/confirm": TestConfirmCreateIncident,
  "/test/result": TestResultScreen,
};
