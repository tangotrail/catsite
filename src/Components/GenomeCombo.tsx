import React from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import * as GT from "./GeneticsTypes";

interface GenomeComboProps {
  genome1: GT.Genome;
  genome2: GT.Genome;
}

const GenomeCombo = (props: GenomeComboProps) => {
  const traits: string[] = GT.Traits.map((trait: string) =>
    trait.toLowerCase().replace(" ", "")
  );

  return (
    <Box className="GenomeCombo">
      {traits.map((trait: string, index: number) => {
        if (
          props.genome1[trait as keyof GT.Genome] !== undefined &&
          props.genome2[trait as keyof GT.Genome] !== undefined
        )
          return (
            <Grid container>
              <Grid
                xs={12}
                md={4}
                className="bold"
                sx={{ textAlign: "center" }}
              >
                {GT.Traits[index]}
              </Grid>
              <Grid xs={12} md={8}>
                statistics
              </Grid>
            </Grid>
          );
        else return <></>;
      })}
    </Box>
  );
};

export default GenomeCombo;
