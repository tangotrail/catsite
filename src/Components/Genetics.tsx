import "../Styles/Genetics.css";
import React, { useState } from "react";

import Grid from "@mui/material/Grid";

import * as GT from "./GeneticsTypes";
import GenomeParser from "./GenomeParser";
import GenomeCombo from "./GenomeCombo";

interface GeneticsProps {}

const Genetics = (props: GeneticsProps) => {
  const [genome1, setGenome1] = useState<GT.Genome>({});
  const [genome2, setGenome2] = useState<GT.Genome>({});

  return (
    <Grid container xs={12}>
      <Grid item xs={12} md={4} sx={{ padding: "2em" }}>
        <GenomeParser onChange={setGenome1} />
      </Grid>
      <Grid item xs={12} md={4} sx={{ padding: "2em" }}>
        <GenomeParser onChange={setGenome2} />
      </Grid>
      <Grid item xs={12} md={4} sx={{ padding: "2em" }}>
        <GenomeCombo genome1={genome1} genome2={genome2} />
      </Grid>
    </Grid>
  );
};

export default Genetics;
