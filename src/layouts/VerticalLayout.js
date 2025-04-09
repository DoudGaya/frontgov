// ** React Imports
import {Outlet, useNavigate} from "react-router-dom";

// ** Core Layout Import
// !Do not remove the Layout import
import Layout from "@layouts/VerticalLayout";

import {
    Calendar, Box, Database, Type, UserCheck, Activity, List, Award, Briefcase, Plus, Folder, ZoomOut,
    Home, Mail, CreditCard, Edit3,
    Users, Key, Tag, Settings, DollarSign, BarChart, UserPlus
} from "react-feather";
import {connect} from "react-redux";
import {useEffect, useState} from "react";

const VerticalLayout = (props) => {
    const navigate = useNavigate()
    const [pageLinks, setPageLinks] = useState([]);
    const login_data = props.loginData;

    const setLinks = () => {
        let nav_link = [{id: 'dashboards', perm: '', title: 'Dashboards', icon: <Home />, navLink: '/dashboard'}]

        //FINANCE
        nav_link.push({
            id: 'finances',
            title: 'Finance',
            perm: 'finance_module',
            icon: <DollarSign />,
            children: [
                {
                    id: 'finance_account',
                    title: 'Finance Account',
                    perm: 'finance_account',
                    icon: <DollarSign />,
                    navLink: '/finance/account'
                },
                {
                    id: 'finance_year',
                    title: 'Financial Year',
                    perm: 'finance_year',
                    icon: <DollarSign />,
                    navLink: '/finance/year'
                },
                {
                    id: 'finance_gl',
                    title: 'General Ledger',
                    perm: 'finance_general_ledger',
                    icon: <DollarSign />,
                    navLink: '/finance/general-ledger'
                },
                {
                    id: 'finance_ledger_branch',
                    title: 'Ledger Branch',
                    perm: 'finance_ledger_branch',
                    icon: <DollarSign />,
                    navLink: '/finance/ledger-branch'
                },
                {
                    id: 'finance_ledger_document',
                    title: 'Ledger Document',
                    perm: 'finance_ledger_document',
                    icon: <DollarSign />,
                    navLink: '/finance/ledger-document'
                },
                {
                    id: 'finance_ledger_entries',
                    title: 'Ledger Entries',
                    perm: 'finance_ledger_entry',
                    icon: <DollarSign />,
                    navLink: '/finance/ledger-entries'
                },
                {
                    id: 'finance_journal_transaction',
                    title: 'Journal Transaction',
                    perm: 'finance_journal',
                    icon: <DollarSign />,
                    navLink: '/finance/journal-transaction'
                },
                {
                    id: 'finance_fund_request',
                    title: 'Fund Request',
                    perm: 'finance_payment_request',
                    icon: <DollarSign />,
                    navLink: '/finance/fund-request'
                },
            ]
        })

        //INVENTORY
        nav_link.push({
            id: 'inventory_module',
            title: 'Inventory',
            perm: 'inventory_module',
            icon: <Box />,
            children: [
                {
                    id: 'inventory',
                    title: 'Inventory',
                    perm: 'inventory_inventory',
                    icon: <Database />,
                    navLink: '/inventory/history'
                },
                {
                    id: 'category',
                    title: 'Category',
                    perm: 'inventory_category',
                    icon: <Type />,
                    navLink: '/inventory/category'
                },
                {
                    id: 'manufacturer',
                    title: 'Manufacturer',
                    perm: 'inventory_manufacturer',
                    icon: <Activity />,
                    navLink: '/inventory/manufacturer'
                },
                {
                    id: 'vendor',
                    title: 'Vendor',
                    perm: 'inventory_vendor',
                    icon: <UserCheck />,
                    navLink: '/inventory/vendor'
                },
                {
                    id: 'item',
                    title: 'Item List',
                    perm: 'inventory_item',
                    icon: <List />,
                    navLink: '/inventory/item-list'
                },
                {
                    id: 'my_request',
                    title: 'My Request',
                    perm: 'inventory_my_request',
                    icon: <Award />,
                    navLink: '/inventory/my-request'
                },
                {
                    id: 'requests',
                    title: 'Requests',
                    perm: 'inventory_requests',
                    icon: <Briefcase />,
                    navLink: '/inventory/requests'
                },
                {
                    id: 'order',
                    title: 'Order',
                    perm: 'inventory_order',
                    icon: <Plus />,
                    navLink: '/inventory/order'
                },
                {
                    id: 'transactions',
                    title: 'Transactions',
                    perm: 'inventory_transaction',
                    icon: <Folder />,
                    navLink: '/inventory/transactions'
                },
                {
                    id: 'audits',
                    title: 'Audits',
                    perm: 'inventory_audit',
                    icon: <ZoomOut />,
                    navLink: '/inventory/audits'
                },
            ]
        })

        //BUDGET
        nav_link.push({
            id: 'budget',
            title: 'Budget',
            perm: 'budget_module',
            icon: <CreditCard />,
            children: [
                {
                    id: 'budget_manager',
                    title: 'Budget Manager',
                    perm: 'budget_manager',
                    icon: <CreditCard />,
                    navLink: '/budget-manager'
                },
                {
                    id: 'my_budget',
                    title: 'My Budget',
                    perm: 'budget_my_budget',
                    icon: <CreditCard />,
                    navLink: '/my-budget'
                },
            ]
        })

        //FUND REQUEST
        nav_link.push({
            id: 'fund_request',
            title: 'Fund Request',
            perm: 'fund_request_module',
            icon: <Mail />,
            children: [
                {
                    id: 'request_box',
                    title: 'Fund Request',
                    perm: 'fund_request',
                    icon: <Mail />,
                    navLink: '/fund-request'
                },
                {
                    id: 'request_secretariat',
                    title: 'Request Secretariat',
                    perm: 'fund_request_secretariat',
                    icon: <Mail />,
                    navLink: '/secretariat-fund-request'
                },
                {
                    id: 'request_calender',
                    title: 'Request Calender',
                    perm: 'fund_request_calender',
                    icon: <Calendar />,
                    navLink: '/fund-request-calender'
                },
            ]
        })

        //HR EMPLOYEE
        nav_link.push({
            id: 'hr_manager',
            title: 'HR Manager',
            perm: 'hr_manager',
            icon: <Users />,
            children: [
                {
                    id: 'employee-manager',
                    title: 'Employee Manager',
                    perm: 'hr_manager',
                    icon: <UserPlus />,
                    navLink: '/hr/employee-manager'
                },
                {
                    id: 'employee_profile',
                    title: 'Employee Profile',
                    perm: 'hr_employee_profile',
                    icon: <UserCheck />,
                    navLink: '/hr/employee-profile'
                },
                {
                    id: 'employee_transfer_request',
                    title: 'Transfer Request',
                    perm: 'hr_employee_transfer_request',
                    icon: <UserCheck />,
                    navLink: '/hr/employee-transfer-request'
                },
            ]
        })

        //HR PAYROLL
        nav_link.push({
            id: 'hr_payroll',
            title: 'HR Payroll',
            perm: 'hr_payroll',
            icon: <DollarSign />,
            children: [
                {
                    id: 'salary_settings',
                    title: 'Salary Settings',
                    perm: 'hr_payroll_settings',
                    icon: <Settings />,
                    navLink: '/hr/salary-settings'
                },
                {
                    id: 'salary_allowance',
                    title: 'Allowance',
                    perm: 'hr_payroll_allowance',
                    icon: <DollarSign />,
                    navLink: '/hr/salary-allowance'
                },
                {
                    id: 'run_allowance',
                    title: 'Run Allowance',
                    perm: 'hr_payroll_run_allowance',
                    icon: <DollarSign />,
                    navLink: '/hr/run-allowance'
                },
                {
                    id: 'post_schedule',
                    title: 'Post Schedule',
                    perm: 'hr_payroll_post_schedule',
                    icon: <DollarSign />,
                    navLink: '/hr/post-schedule'
                },
                {
                    id: 'allowance_report',
                    title: 'Allowance Report',
                    perm: 'hr_payroll_allowance_report',
                    icon: <BarChart />,
                    navLink: '/hr/allowance-report'
                },
                {
                    id: 'salary_report',
                    title: 'Salary Report',
                    perm: 'hr_payroll_salary_report',
                    icon: <BarChart />,
                    navLink: '/hr/salary-report'
                },
                {
                    id: 'bank_payment',
                    title: 'Bank Payment',
                    perm: 'hr_payroll_bank_payment',
                    icon: <BarChart />,
                    navLink: '/hr/bank-payment-report'
                },
            ]
        })

        //HR PENSION
        nav_link.push({
            id: 'hr_pension',
            title: 'HR Pension',
            perm: 'hr_pension',
            icon: <Users />,
            children: [
                {
                    id: 'pension_settings',
                    title: 'Pension Settings',
                    perm: 'hr_pension_settings',
                    icon: <Settings />,
                    navLink: '/hr/pension-settings'
                },
                {
                    id: 'pension_administrator',
                    title: 'Administrator',
                    perm: 'hr_pension_administration',
                    icon: <UserCheck />,
                    navLink: '/hr/pension-administrator'
                },
                {
                    id: 'pension_enrolment',
                    title: 'Pension Enrolment',
                    perm: 'hr_pension_enrolment',
                    icon: <UserPlus />,
                    navLink: '/hr/pension-enrolment'
                },
                {
                    id: 'pension_report',
                    title: 'Pension Report',
                    perm: 'hr_pension_report',
                    icon: <BarChart />,
                    navLink: '/hr/pension-report'
                },
            ]
        })

        //FINANCE REPORT
        nav_link.push({
            id: 'finance_report',
            title: 'Finance Reports',
            perm: 'finance_report_module',
            icon: <BarChart />,
            children: [
                {
                    id: 'general_ledger_report',
                    title: 'General Ledger',
                    perm: 'finance_report_general_ledger',
                    icon: <BarChart />,
                    navLink: '/finance/report/general-ledger'
                },
                {
                    id: 'balance_sheet_report',
                    title: 'Balance Sheet',
                    perm: 'finance_report_balance_sheet',
                    icon: <BarChart />,
                    navLink: '/finance/report/balance-sheet'
                },
                {
                    id: 'bank_reconciliation_report',
                    title: 'Bank Reconciliation',
                    perm: 'finance_report_bank_reconciliation',
                    icon: <BarChart />,
                    navLink: '/finance/report/bank-reconciliation'
                },
                {
                    id: 'income_statement_report',
                    title: 'Income Statement',
                    perm: 'finance_report_income_statement',
                    icon: <BarChart />,
                    navLink: '/finance/report/income-statement'
                },
                {
                    id: 'trial_balance_report',
                    title: 'Trial Balance',
                    perm: 'finance_report_trial_balance',
                    icon: <BarChart />,
                    navLink: '/finance/report/trial-balance'
                },
                {
                    id: 'fund_request_report_items',
                    title: 'Fund Request Items',
                    perm: 'finance_report_fund_request',
                    icon: <BarChart />,
                    navLink: '/finance/report/request-items-report'
                },
                {
                    id: 'finance_payment_report',
                    title: 'Payment Report',
                    perm: 'finance_payment_report',
                    icon: <BarChart />,
                    navLink: '/finance/report/payment-report'
                },
            ]
        })

        //SETTINGS
        nav_link.push({
            id: 'settings',
            title: 'Settings',
            perm: 'settings_module',
            icon: <Settings />,
            children: [
                {
                    id: 'agency',
                    title: 'Agency Manager',
                    perm: 'settings_agency_manager',
                    icon: <Home />,
                    navLink: '/settings/agency-manager'
                },
                {
                    id: 'user_manager',
                    title: 'User Manager',
                    perm: 'settings_user_manager',
                    icon: <Users />,
                    navLink: '/settings/user-manager'
                },
                {
                    id: 'permission',
                    title: 'Permission',
                    perm: 'settings_permission',
                    icon: <Key />,
                    navLink: '/settings/permission'
                },
                {
                    id: 'position',
                    title: 'User Position',
                    perm: 'settings_user_position',
                    icon: <Tag />,
                    navLink: '/settings/position'
                }
            ]
        })

        if (login_data.length > 0) {
            const permission_array = [];
            const permission = login_data[0].permission;
            nav_link.map(perm => {
                if (perm.perm === '') {
                    permission_array.push(perm);
                } else {
                    if (permission.filter(r=>r.permission === perm.perm).length > 0) {
                        let children = [];
                        let perms;
                        if (typeof perm.children !== 'undefined' && perm.children.length > 0) {
                            perm.children.map(child => {
                                if (permission.filter(r=>r.permission === child.perm).length > 0) {
                                    children.push(child);
                                }
                            })
                            perms = { id: perm.id, title: perm.title, perm: perm.perm, icon: perm.icon, children: children };
                        } else {
                            perms = { id: perm.id, title: perm.title, perm: perm.perm, icon: perm.icon, navLink: perm.navLink };
                        }
                        permission_array.push(perms);
                    }

                }
            })

            setPageLinks(permission_array)
        }

    }

    useEffect(()=>{
        if (login_data.length < 1) {
            navigate("/login")
        } else
        {
            setLinks();
        }
    },[])

  return (
    <Layout menuData={
        pageLinks
    } {...props}>
      <Outlet />
    </Layout>
  );
};

const mapStateToProps = (state) => {
    return {
        loginData: state.LoginDetails
    }
}

export default connect(mapStateToProps, null)(VerticalLayout)
