// ** React Imports
import { Fragment, lazy } from "react";
// ** Layouts
import BlankLayout from "@layouts/BlankLayout";
import VerticalLayout from "@src/layouts/VerticalLayout";
import LayoutWrapper from "@src/@core/layouts/components/layout-wrapper";

// ** Route Components
import PublicRoute from "@components/routes/PublicRoute";

// ** Utils
import { isObjEmpty } from "@utils";

const getLayout = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />
};

// ** Default Route
const DefaultRoute = "/";

const Login = lazy(() => import("../../views/authentication/login"));
const ForgotPassword = lazy(() => import("../../views/authentication/forgot-password"));
const ResetPassword = lazy(() => import("../../views/authentication/reset-password"));
const Error = lazy(() => import("../../views/Error"));
const Dashboard = lazy(() => import('@src/views/index'))
const UserProfile = lazy(() => import('@src/views/profile/user-profile'))
const AdminProfile = lazy(() => import('@src/views/profile/admin-profile'))

const AgencyManager = lazy(() => import('@src/views/settings/agency/manage-agency'))
const UserManagement = lazy(() => import('@src/views/settings/user-manager/user-manager'))
const Permission = lazy(() => import('@src/views/settings/permission/permission'))
const Position = lazy(() => import('@src/views/settings/position/position'))

const FundRequest = lazy(() => import('@src/views/fund-request/FundRequest'))
const FundRequestPreviewCard = lazy(() => import('@src/views/fund-request/fund-request-template/RequestPreview'))
const SecretariatFundRequest = lazy(() => import('@src/views/fund-request/SecretariatFundRequest'))
const FundRequestCalendar = lazy(() => import('@src/views/fund-request/RequestCalender'))

const FinanceFundRequest = lazy(() => import('@src/views/finance/finance-fund-request/finance-fund-request'))
const FinanceAccount = lazy(() => import('@src/views/finance/finance-account/finance-account'))
const FinanceYear = lazy(() => import('@src/views/finance/finance-year/finance-year'))
const FinanceGL = lazy(() => import('@src/views/finance/finance-general-ledger/finance-general-ledger'))
const FinanceLedgerBranch = lazy(() => import('@src/views/finance/finance-ledger-branch/finance-ledger-branch'))
const FinanceLedgerDocument = lazy(() => import('@src/views/finance/finance-ledger-document/finance-ledger-document'))
const FinanceLedgerEntries = lazy(() => import('@src/views/finance/finance-ledger-entries/ledger-entries'))
const FinanceJournal = lazy(() => import('@src/views/finance/finance-journal-transaction/finance-journal-transaction'))
const FinanceReportBalanceSheet = lazy(() => import('@src/views/finance/reports/balance-sheet-report'))
const FinanceReportBankReconciliation = lazy(() => import('@src/views/finance/reports/bank-reconciliation'))
const FinanceReportGeneralLedger = lazy(() => import('@src/views/finance/reports/general-ledger-report'))
const IncomeStatementReport = lazy(() => import('@src/views/finance/reports/income-statement'))
const TrialBalanceReport = lazy(() => import('@src/views/finance/reports/trial-balance'))
const FundRequestItemsReport = lazy(() => import('@src/views/finance/reports/fund-request-items'))
const FinancePaymentReport = lazy(() => import('@src/views/finance/reports/finance-payment-report'))

const InventoryAudits = lazy(() => import('@src/views/inventory/audit-log/inventory-audit-log'))
const InventoryCategory = lazy(() => import('@src/views/inventory/category/category'))
const Inventory = lazy(() => import('@src/views/inventory/inventory/inventory'))
const InventoryItem = lazy(() => import('@src/views/inventory/item/item'))
const InventoryManufacturer = lazy(() => import('@src/views/inventory/manufacturer/manufacturer'))
const InventoryMyRequest = lazy(() => import('@src/views/inventory/my-request/my-request'))
const InventoryOrder = lazy(() => import('@src/views/inventory/order/inventory-order'))
const InventoryRequests = lazy(() => import('@src/views/inventory/requests/inventory-request'))
const InventoryTransaction = lazy(() => import('@src/views/inventory/transaction/transaction'))
const InventoryVendor = lazy(() => import('@src/views/inventory/vendor/vendor'))

const BudgetManager = lazy(() => import('@src/views/budget/budget'))
const MyBudgetManager = lazy(() => import('@src/views/budget/my-budget'))

const EmployeeManagement = lazy(() => import('@src/views/human-resources/employee/employee-manager'))
const PensionSettings = lazy(() => import('@src/views/human-resources/pension/settings/settings'))
const PensionAdministrator = lazy(() => import('@src/views/human-resources/pension/administrator/administrator'))
const PensionEnrolment = lazy(() => import('@src/views/human-resources/pension/enrolment/enrolment'))
const PensionReport = lazy(() => import('@src/views/human-resources/pension/report/report'))
const SalarySettings = lazy(() => import('@src/views/human-resources/payroll/settings/settings'))
const SalaryAllowance = lazy(() => import('@src/views/human-resources/payroll/allowance/allowance'))
const RunSalaryAllowance = lazy(() => import('@src/views/human-resources/payroll/allowance/run-allowance'))
const PostSchedule = lazy(() => import('@src/views/human-resources/payroll/post-schedule/post-schedule'))
const AllowanceReport = lazy(() => import('@src/views/human-resources/payroll/report/allowance-report'))
const SalaryReport = lazy(() => import('@src/views/human-resources/payroll/report/salary-report'))
const BankPaymentReport = lazy(() => import('@src/views/human-resources/payroll/report/bank-payment-report'))
const EmployeeTransferRequest = lazy(() => import('@src/views/human-resources/employee/employee-transfer-request'))
const EmployeeProfile = lazy(() => import('@src/views/human-resources/employee/employee-profile'))

// ** Merge Routes
const Routes = [
  {path: "/login", element: <Login />, meta: {layout: "blank"}},
  {path: '/dashboard', element: <Dashboard />, meta: {className: 'app-user-list'}},
  {path: "/forgot-password", element: <ForgotPassword />, meta: {layout: "blank"}},
  {path: "/password-reset/:slug", element: <ResetPassword />, meta: {layout: "blank"}},
  {path: "/user-profile/:slug", element: <UserProfile />, meta: {className: "app-user-list"}},
  {path: "/admin-profile/:slug", element: <AdminProfile />, meta: {className: "app-user-list"}},

  {path: '/fund-request', element: <FundRequest />, meta: {appLayout: true, className: 'email-application'}},
  {path: '/secretariat-fund-request', element: <SecretariatFundRequest />, meta: {appLayout: true, className: 'email-application'}},
  {path: '/fund-request-calender', element: <FundRequestCalendar />, meta: {className: 'app-user-list'}},
  {path: "/fund-request/preview/:slug", element: <FundRequestPreviewCard />, meta: {className: "app-user-list"}},

  {path: '/settings/agency-manager', element: <AgencyManager />, meta: {className: 'app-user-list'}},
  {path: '/settings/user-manager', element: <UserManagement />, meta: {className: 'app-user-list'}},
  {path: '/settings/position', element: <Position />, meta: {className: 'app-user-list'}},
  {path: '/settings/permission', element: <Permission />, meta: {className: 'app-user-list'}},

  {path: '/finance/account', element: <FinanceAccount />, meta: {className: 'app-user-list'}},
  {path: '/finance/fund-request', element: <FinanceFundRequest />, meta: {className: 'app-user-list'}},
  {path: '/finance/year', element: <FinanceYear />, meta: {className: 'app-user-list'}},
  {path: '/finance/general-ledger', element: <FinanceGL />, meta: {className: 'app-user-list'}},
  {path: '/finance/ledger-branch', element: <FinanceLedgerBranch />, meta: {className: 'app-user-list'}},
  {path: '/finance/ledger-document', element: <FinanceLedgerDocument />, meta: {className: 'app-user-list'}},
  {path: '/finance/ledger-entries', element: <FinanceLedgerEntries />, meta: {className: 'app-user-list'}},
  {path: '/finance/journal-transaction', element: <FinanceJournal />, meta: {className: 'app-user-list'}},
  {path: '/finance/report/balance-sheet', element: <FinanceReportBalanceSheet />, meta: {className: 'app-user-list'}},
  {path: '/finance/report/bank-reconciliation', element: <FinanceReportBankReconciliation />, meta: {className: 'app-user-list'}},
  {path: '/finance/report/income-statement', element: <IncomeStatementReport />, meta: {className: 'app-user-list'}},
  {path: '/finance/report/trial-balance', element: <TrialBalanceReport />, meta: {className: 'app-user-list'}},
  {path: '/finance/report/general-ledger', element: <FinanceReportGeneralLedger />, meta: {className: 'app-user-list'}},
  {path: '/finance/report/request-items-report', element: <FundRequestItemsReport />, meta: {className: 'app-user-list'}},
  {path: '/finance/report/payment-report', element: <FinancePaymentReport />, meta: {className: 'app-user-list'}},

  {path: '/inventory/history', element: <Inventory />, meta: {className: 'app-user-list'}},
  {path: '/inventory/audits', element: <InventoryAudits />, meta: {className: 'app-user-list'}},
  {path: '/inventory/category', element: <InventoryCategory />, meta: {className: 'app-user-list'}},
  {path: '/inventory/item-list', element: <InventoryItem />, meta: {className: 'app-user-list'}},
  {path: '/inventory/manufacturer', element: <InventoryManufacturer />, meta: {className: 'app-user-list'}},
  {path: '/inventory/my-request', element: <InventoryMyRequest />, meta: {className: 'app-user-list'}},
  {path: '/inventory/order', element: <InventoryOrder />, meta: {className: 'app-user-list'}},
  {path: '/inventory/requests', element: <InventoryRequests />, meta: {className: 'app-user-list'}},
  {path: '/inventory/transactions', element: <InventoryTransaction />, meta: {className: 'app-user-list'}},
  {path: '/inventory/vendor', element: <InventoryVendor />, meta: {className: 'app-user-list'}},

  {path: '/budget-manager', element: <BudgetManager />, meta: {className: 'app-user-list'}},
  {path: '/my-budget', element: <MyBudgetManager />, meta: {className: 'app-user-list'}},

  {path: '/hr/employee-manager', element: <EmployeeManagement />, meta: {className: 'app-user-list'}},
  {path: '/hr/pension-settings', element: <PensionSettings />, meta: {className: 'app-user-list'}},
  {path: '/hr/pension-administrator', element: <PensionAdministrator />, meta: {className: 'app-user-list'}},
  {path: '/hr/pension-enrolment', element: <PensionEnrolment />, meta: {className: 'app-user-list'}},
  {path: '/hr/pension-report', element: <PensionReport />, meta: {className: 'app-user-list'}},
  {path: '/hr/salary-settings', element: <SalarySettings />, meta: {className: 'app-user-list'}},
  {path: '/hr/salary-allowance', element: <SalaryAllowance />, meta: {className: 'app-user-list'}},
  {path: '/hr/run-allowance', element: <RunSalaryAllowance />, meta: {className: 'app-user-list'}},
  {path: '/hr/post-schedule', element: <PostSchedule />, meta: {className: 'app-user-list'}},
  {path: '/hr/allowance-report', element: <AllowanceReport />, meta: {className: 'app-user-list'}},
  {path: '/hr/salary-report', element: <SalaryReport />, meta: {className: 'app-user-list'}},
  {path: '/hr/bank-payment-report', element: <BankPaymentReport />, meta: {className: 'app-user-list'}},
  {path: '/hr/employee-transfer-request', element: <EmployeeTransferRequest />, meta: {className: 'app-user-list'}},
  {path: '/hr/employee-profile', element: <EmployeeProfile />, meta: {className: 'app-user-list'}},


  {path: '/', element: <Dashboard />, meta: {className: 'app-user-list'}},
  {path: "/error", element: <Error />, meta: {layout: "blank"}},
];

const getRouteMeta = (route) => {
  if (isObjEmpty(route.element.props)) {
    if (route.meta) {
      return { routeMeta: route.meta };
    } else {
      return {};
    }
  }
};

// ** Return Filtered Array of Routes & Paths
const MergeLayoutRoutes = (layout, defaultLayout) => {
  const LayoutRoutes = [];

  if (Routes) {
    Routes.filter((route) => {
      let isBlank = false;
      // ** Checks if Route layout or Default layout matches current layout
      if (
        (route.meta && route.meta.layout && route.meta.layout === layout) ||
        ((route.meta === undefined || route.meta.layout === undefined) &&
          defaultLayout === layout)
      ) {
        const RouteTag = PublicRoute;

        // ** Check for public or private route
        if (route.meta) {
          route.meta.layout === "blank" ? (isBlank = true) : (isBlank = false);
        }
        if (route.element) {
          const Wrapper =
            // eslint-disable-next-line multiline-ternary
            isObjEmpty(route.element.props) && isBlank === false
              ? // eslint-disable-next-line multiline-ternary
                LayoutWrapper
              : Fragment;

          route.element = (
            <Wrapper {...(isBlank === false ? getRouteMeta(route) : {})}>
              <RouteTag route={route}>{route.element}</RouteTag>
            </Wrapper>
          );
        }

        // Push route to LayoutRoutes
        LayoutRoutes.push(route);
      }
      return LayoutRoutes;
    });
  }
  return LayoutRoutes;
};

const getRoutes = (layout) => {
  const defaultLayout = layout || "vertical";
  const layouts = ["vertical", "blank"];

  const AllRoutes = [];

  layouts.forEach((layoutItem) => {
    const LayoutRoutes = MergeLayoutRoutes(layoutItem, defaultLayout);

    AllRoutes.push({
      path: "/",
      element: getLayout[layoutItem] || getLayout[defaultLayout],
      children: LayoutRoutes,
    });
  });
  return AllRoutes;
};

export { DefaultRoute, Routes, getRoutes };
