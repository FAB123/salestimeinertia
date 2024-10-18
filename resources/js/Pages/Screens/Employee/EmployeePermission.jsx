import React from "react";
import { useFieldArray } from "react-hook-form";

import { Card, Grid, CardContent } from "@mui/material";

import { useTranslation } from "react-i18next";
import { FormSwitch } from "../../../components/mui";
import SetPermission from "./SetPermission";

function EmployeePermission({ control, register }) {
  const { t } = useTranslation();
  const { fields } = useFieldArray({
    control,
    name: "permissions",
  });

  return (
    <>
      <Grid container spacing={2}>
        {fields.map((field, index) => (
          <Grid item sm={3} key={field.id}>
            <Card>
              <CardContent>
                <FormSwitch
                  name={`permissions[${index}].active`}
                  control={control}
                  //ref={register()}
                  label={t(`modules.${field.permission_id}`)}
                  head={true}
                />

                <SetPermission nestIndex={index} {...{ control, register }} />

                {field.submenus && (
                  <SetPermission
                    nestIndex={index}
                    submenus="1"
                    {...{ control, register }}
                  />
                )}

                {field.reportList && (
                  <SetPermission
                    nestIndex={index}
                    submenus="2"
                    {...{ control, register }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default EmployeePermission;
