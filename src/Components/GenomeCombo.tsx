import React, { useEffect, useState } from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import * as GT from "./GeneticsTypes";
import * as GL from "./GeneticsLogic";

interface GenomeComboProps {
  genome1: GT.Genome;
  genome2: GT.Genome;
}

const GenomeCombo = (props: GenomeComboProps) => {
  const traitStrings: string[] = Object.values(GT.Trait).map((trait: string) =>
    trait.toLowerCase().replace(" ", "")
  );
  const [combo, setCombo] = useState<Array<Array<GT.Gene[]>>>([]);
  const [phenos, setPhenos] = useState<Array<Array<GL.PossiblePheno>>>([[]]);

  useEffect(() => {
    setCombo(GL.combineGenomes(props.genome1, props.genome2));
  }, [props.genome1, props.genome2]);

  useEffect(() => {
    setPhenos(
      Object.values(GT.Trait).map((trait: GT.Trait, i: number) => {
        if (combo.length > i) return GL.genesToPossiblePhenos(trait, combo[i]);
        else return [];
      })
    );
  }, [combo]);

  return (
    <Box className="GenomeCombo">
      {Object.values(GT.Trait).map((trait: GT.Trait, i: number) => {
        if (
          props.genome1[traitStrings[i] as keyof GT.Genome] !== undefined &&
          props.genome2[traitStrings[i] as keyof GT.Genome] !== undefined
        )
          return (
            <Grid container>
              <Grid xs={12} md={4} className="bold" sx={{ textAlign: "center" }}>
                {trait}
              </Grid>
              <Grid container xs={12} md={8}>
                <Grid xs={5} md={3}>
                  {phenos[i].map((pp) => (
                    <>
                      {Math.round(pp.prob * 100)}%<br></br>
                    </>
                  ))}
                  <br></br>
                </Grid>
                <Grid xs={7} md={9}>
                  {phenos[i].map((pp) => (
                    <>
                      {pp.pheno}
                      <br></br>
                    </>
                  ))}
                  <br></br>
                </Grid>
              </Grid>
            </Grid>
          );
        else return <></>;
      })}
    </Box>
  );
};

export default GenomeCombo;
