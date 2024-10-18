import React from "react";
import { useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormSwitch } from "../../../components/mui";

export default ({ nestIndex, control, submenus }) => {
  const { t } = useTranslation();
  var type = "basic";
  if (submenus === "1") {
    type = "submenus";
  } else if (submenus === "2") {
    type = "reportList";
  } else {
    type = "basic";
  }
  const { fields } = useFieldArray({
    control,
    name: `permissions[${nestIndex}].${type}`,
  });

  return (
    <div>
      {fields.map((item, k) => {
        return (
          <div key={item.id} style={{ marginLeft: 20 }}>
            <FormSwitch
              name={`permissions[${nestIndex}].${type}[${k}].active`}
              control={control}
              //ref={register()}
              label={
                submenus
                  ? t(`modules.${item.item}`)
                  : t(`permission.${item.item}`)
              }
            />
          </div>
        );
      })}
    </div>
  );
};
