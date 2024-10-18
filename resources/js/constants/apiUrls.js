//dashboard
export const GETBASICCONFIG = "/dashboard/get_basic_info";
export const GETSALESGRPAH = "/dashboard/get_sales_graph";
export const GETPURCHASEGRPAH = "/dashboard/get_purchase_graph";
export const APPTRANSILATE = "/transilate";

//customer
export const GETALLCUSTOMERS = "/customers/get_all_customers";
export const DELETECUSTOMERS = "/customers/delete_customer";
export const GETALLCUSTOMERSLIST = "/customers/get_all_customers_list";
export const SEARCHCUSTOMERLIST = "/customers/search_customers/";
export const GETCUSTOMERBYID = "/customers/get_customer_by_id/";
export const SAVECUSTOMER = "/customers/save_customer";

//supplier
export const GETALLSUPPLIERS = "/suppliers/get_all_suppliers";
export const DELETESUPPLIERS = "/suppliers/delete_suppliers";
export const GETALLSUPPLIERSLIST = "/suppliers/get_all_suppliers_list";
export const SEARCHSUPPLIERLIST = "/suppliers/search_suppliers/";
export const GETSUPPLIERBYID = "/suppliers/get_supplier_by_id/";

//employees
export const GETALLEMPLOYEES = "/employee/get_all_employees";
export const GETALLEMPLOYEESLIST = "/employee/get_all_employees_list";
export const GETEMPLOYEEBYID = "/employee/get_employee_by_id/";
export const GETDEFAULTPERMISSIONS = "/employee/get_default_permissions";
export const SEARCHEMPLOYEELIST = "/employee/search_employees/";
export const DELETEEMPLOYEE = "/delete_customer";
export const SAVEEMPLOYEE = "/employee/save_employee";

//message
export const SENDEMAIL = "/message/send_text_email";

//items
export const GETITEMBYBARCODEORID = "/items/search_items_by_barcode";
export const GETALLITEMS = "/items/get_all_items";
export const DELETEITEMS = "/items/delete_items";
export const SEARCHSALEITEMLIST = "/items/search_items/S/";
export const SEARCHPURCHASEITEMLIST = "/items/search_items/P/";
export const GETITEMBYID = "/items/get_item_by_id/";
export const VALIDATEBARCODE = "/items/validate_barcode/";
export const GENERATEBARCODE = "/items/generate_barcode";
export const GETINVENTORYDETAILS = "/items/get_inventory_details";

//opening balance
export const GETITEMSOB = "/items/search_items_for_ob";
export const SAVEITEMOB = "/items/save_items_ob";

//boxed items
export const GETALLBOXEDITEMS = "/bundleditems/get_all_boxed_items";
export const GETBOXEDITEMBYID = "/bundleditems/get_boxed_item_by_id";
export const SAVEBOXEDITEM = "/bundleditems/save_boxed_item";

//quatation
export const SAVEQUATATION = "/quatation/save_quatation";
export const GETQUATATION = "/quatation/get_quotation";
export const GETQUATATIONBYID = "/quatation/get_quotation_by_id";
export const GETQUATATIONSALE = "/quatation/get_quatation_details";

//workorder
export const SAVEWORKORDER = "/workorder/save_work_order";
export const UPDATEWORKORDERSTATUS = "/workorder/update_work_order_status";
export const GETWORKORDERBYID = "/workorder/get_workorder_by_id"; //for invoice
export const GETWORKORDERDETAILSBYID = "/workorder/get_workorder_details_by_id"; //for report

export const FINDWORKORDERBYCUSTOMER =
    "/workorder/get_workorder_details_by_customer";

//sales
export const SAVESALE = "/sales/save_sale";
export const GETSALESHISTORY = "/sales/get_sales_history";
export const GETSALEBYID = "/sales/get_sale_by_id";

//gazt
export const GETALLGAZTJOBS = "/gazt/gazt_job_requests";
export const GETALLGAZTJOBREQUEST = "/gazt/gazt_api_request";

//Requisition
export const SAVEREQUISITION = "/purchase/save_requisition";
export const GETREQUISITIONBYID = "/purchase/get_requisition_by_id";

//purchase
export const SAVEPURCHASE = "/purchase/save_purchase";
export const GETPURCHASEBYID = "/purchase/get_purchase_by_id";
export const GETPURCHASEIMAGE = "/purchase/get_purchase_image/";

//sales recipts
export const GETCASHSALE = "/sales/get_sale";
export const GETCASHSALERETURN = "/sales/get_sale";
export const GETCREDITSALE = "/sales/get_sale";
export const GETCREDITSALERETURN = "/sales/get_sale";
export const GETDAILYSALES = "/sales/get_daily_sales";

//suspended sales
export const SUSPENDSALE = "/suspended_sales/save_suspended";
export const GETSUSPENEDSALE = "/suspended_sales/get_suspended_details";
export const GETALLSUSPENEDSALE = "/suspended_sales/get_all_suspended";

//accounts
export const ALLACCOUNTHEADS = "/accounts/get_all_account_heads";
export const GETALLACCOUNTHEADS = "/accounts/get_all_account_head_list";
export const GETALLACCOUNTPAYMENTHEADS =
    "/accounts/get_all_account_payment_head_list";
export const UPDATEACCOUNTHEADS = "/accounts/update_account_heads";
export const DELETEACCOUNTHEAD = "/accounts/delete_account_head";
export const VALIDATEACCOUNTHEAD = "/accounts/validate_account_head/";
export const NEWACCOUNTHEAD = "/accounts/create_new_account_head";
export const GETACCOUNTHEADOB = "/accounts/get_account_heads_ob";
export const UPDATEACCOUNTHEADSOB = "/accounts/update_account_head_ob";
export const SAVEVOUCHERDATA = "/accounts/save_voucher_data";

//configuration
export const SERACHBRANCHES = "/configurations/search_branches/";

export const GETALLSTORES = "/configurations/get_all_stores";
export const GETSTOREBYID = "/configurations/get_store_by_id/";
export const SAVESTORE = "/configurations/save_store";
export const DELETESTOREBYID = "/configurations/delete_store_by_id/";

export const GETALLTABLES = "/configurations/get_all_tables";
export const GETTABLEBYID = "/configurations/get_table_by_id/";
export const DELETETABLEBYID = "/configurations/delete_table_by_id/";
export const SAVETABLE = "/configurations/save_table";

export const GETALLPAYMENTS = "/configurations/get_all_payments";
export const GETALLACTIVEPAYMENTS = "/configurations/get_all_active_payments";

export const GETALLUNITS = "/configurations/get_all_units";
export const GETUNITBYID = "/configurations/get_unit_by_id/";
export const SAVEUNIT = "/configurations/save_unit";
export const DELETEUNITBYID = "/configurations/delete_unit_by_id/";

export const GETALLWORKORDERSTATUS = "/configurations/get_all_workorder_status";
export const GETWORKORDERSTATUSBYID =
    "/configurations/get_workorder_status_by_id/";
export const SAVEWORKORDERSTATUS = "/configurations/save_workorder_status";
export const DELETEWORKORDERSTATUSBYID =
    "/configurations/delete_workorder_status_by_id/";

export const SAVEINVOICETEMPLATE = "/configurations/save_template_by_id";

export const GETPAYMENTOPTIONBYID = "/configurations/get_payment_option_by_id/";
export const SAVEPAYMENTOPTION = "/configurations/save_payment_option";
export const PAYMENTOPTIONSTATUSBYID =
    "/configurations/change_payment_option_status_by_id";
export const SAVECOMPANYLOGO = "/configurations/save_company_logo";
export const GETCOMPANYLOGO = "/configurations/get_company_logo";
export const REMOVECOMPANYLOGO = "/configurations/remove_company_logo";

//messaging template
export const GETMESSAGINGTEMPLATE = "/messages/getmessagingtemplate";
export const SAVEMESSAGINGTEMPLATE = "/messages/savemessagingtemplate";

//gazt
export const generateGAZTCSID = "/configurations/generate_csid";

//todo list
export const SAVETODOTAG = "/todo/save_todo_tag";
export const GETTODOTAGS = "/todo/get_todo_tags";
export const SAVETODO = "/todo/save_todo";
export const GETTODOLIST = "/todo/get_todo_list/";
export const DONETODOBYID = "/todo/done_todo";
export const DELETETODOBYID = "/todo/delete_todo";
export const GETTODOBYID = "/todo/get_todo_by_id/";
