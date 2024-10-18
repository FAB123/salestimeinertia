import * as Yup from "yup";
import i18n from "../i18n";

const vaildateDigit = (value, count) => {
    return new Promise((resolve, reject) => {
        if (value) {
            if (isNaN(value)) {
                resolve(false);
            }
            if (value.toString().length === count) {
                resolve(true);
            } else {
                resolve(false);
            }
        } else {
            resolve(true);
        }
    });
};

const loginTransilationHelper = Yup.object({
    username: Yup.string().required(i18n.t("login.username_required")),
    password: Yup.string().required(i18n.t("login.password_required")),
    store: Yup.string().required(i18n.t("login.store_required")),
});

const activateTransilationHelper = Yup.object({
    activation_key: Yup.string().required(
        i18n.t("common.activation_key_required")
    ),
});

const supplierValidation = Yup.object({
    name: Yup.string().required(i18n.t("common.nameisrequierd")),
    email: Yup.string().email(i18n.t("common.emailisrequired")),
    mobile: Yup.string().typeError(i18n.t("common.mobilemustbeanumber")),
    address_line_1: Yup.string(),
    account_number: Yup.string(),
    contact_person: Yup.string(),
    city: Yup.string(),
    state: Yup.string(),
    country: Yup.string(),
    zip: Yup.string().max(5, i18n.t("common.zipmustbeanumber")),
    vat_number: Yup.string(),
    taxable: Yup.boolean(),
    comments: Yup.string(),
});

const B2CCustomerValidation = Yup.object({
    name: Yup.string().required(i18n.t("common.nameisrequierd")),
    email: Yup.string().email(i18n.t("common.emailisrequired")),
    mobile: Yup.string().typeError(i18n.t("common.mobilemustbeanumber")),
    additional_street: Yup.string(),
    city: Yup.string(),
    city_sub_division: Yup.string(),
    building_number: Yup.string().test(
        "validateBuildingNumber",
        i18n.t("items.valid_building_number"),
        function (value) {
            return vaildateDigit(value, 4).then((x) => x);
        }
    ),
    plot_identification: Yup.string().test(
        "validateBuildingNumber",
        i18n.t("items.valid_plot__number"),
        function (value) {
            return vaildateDigit(value, 4).then((x) => x);
        }
    ),
    identity_type: Yup.string(),
    party_id: Yup.string(),
    state: Yup.string(),
    zip: Yup.string().max(5, i18n.t("common.zipmustbeanumber")),
    company_name: Yup.string(),
    account_number: Yup.string(),
    type: Yup.string(),
    opening_balance: Yup.number(),
    comments: Yup.string(),
    country: Yup.string(),
});

const B2BCustomerValidation = Yup.object({
    name: Yup.string().required(i18n.t("common.nameisrequierd")),
    email: Yup.string().email(i18n.t("common.emailisrequired")),
    mobile: Yup.string().typeError(i18n.t("common.mobilemustbeanumber")),
    street: Yup.string().max(50).required(),
    additional_street: Yup.string().required(),
    city: Yup.string().required(),
    city_sub_division: Yup.string().required(),
    building_number: Yup.string().min(4).max(4),
    plot_identification: Yup.string().min(4).max(4),
    identity_type: Yup.string().required(),
    party_id: Yup.string().required(),
    state: Yup.string().required(),
    zip: Yup.string().max(5, i18n.t("common.zipmustbeanumber")).required(),
    company_name: Yup.string(),
    account_number: Yup.string(),
    type: Yup.string(),
    opening_balance: Yup.number(),
    comments: Yup.string(),
    country: Yup.string(),
});

const employeeValidation = (employeeId) => {
    return Yup.object({
        name: Yup.string().required(i18n.t("employee.namerequired")),
        email: Yup.string().email(i18n.t("common.emailisrequired")),
        mobile: Yup.number().typeError(i18n.t("common.mobilemustbeanumber")),
        address_line_1: Yup.string(),
        username: Yup.string()
            .min(4, i18n.t("employee.usernameminmum"))
            .required(i18n.t("employee.usernamerequired")),
        password: employeeId
            ? Yup.string()
                  //.min(5, i18n.t("employee.passwordminmum"))
                  .matches(/^(|.{5,})$/, i18n.t("employee.passwordminmum"))
            : Yup.string()
                  .min(5, i18n.t("employee.passwordminmum"))
                  .required(i18n.t("employee.passwordrequired")),
        repeat_password: employeeId
            ? Yup.string().oneOf(
                  [Yup.ref("password")],
                  i18n.t("employee.passwordnomatch")
              )
            : Yup.string()
                  .required(i18n.t("employee.repasswordrequired"))
                  .oneOf(
                      [Yup.ref("password")],
                      i18n.t("employee.passwordnomatch")
                  ),
        comments: Yup.string(),
        permissions: Yup.array(),
    });
};

const toDoValidation = Yup.object({
    title: Yup.string().required(i18n.t("common.nameisrequierd")).max(100),
    date: Yup.date().transform(function (value, originalValue) {
        if (this.isType(value)) {
            return value;
        }
        const result = parse(originalValue, "dd.MM.yyyy", new Date());
        return result;
    }),
    tags: Yup.array().test(
        "arr-length",
        i18n.t("required.tags_filed_requierd"),
        (arr) => {
            return arr.length >= 1;
        }
    ),
    description: Yup.string().max(500).required(),
});

export {
    loginTransilationHelper,
    supplierValidation,
    B2BCustomerValidation,
    B2CCustomerValidation,
    toDoValidation,
    employeeValidation,
    activateTransilationHelper,
};
