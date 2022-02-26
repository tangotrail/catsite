import React, { useState, useEffect } from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import * as GT from "./GeneticsTypes";

interface GenomeComboProps {
  genome1?: GT.Genome;
  genome2?: GT.Genome;
}

const GenomeCombo = (props: GenomeComboProps) => {
  return (
    <Box className="GenomeCombo">
      {props.genome1?.species !== undefined &&
        props.genome2?.species !== undefined && (
          <>
            <b>possible babies will go here</b>
            <br></br>species<br></br>
          </>
        )}
      {props.genome1?.wind !== undefined && props.genome2?.wind !== undefined && (
        <>
          wind<br></br>
        </>
      )}
      {props.genome1?.furtype !== undefined &&
        props.genome2?.furtype !== undefined && (
          <>
            furtype<br></br>
          </>
        )}
      {props.genome1?.color !== undefined &&
        props.genome2?.color !== undefined && (
          <>
            color<br></br>
          </>
        )}
      {props.genome1?.pattern !== undefined &&
        props.genome2?.pattern !== undefined && (
          <>
            pattern<br></br>
          </>
        )}
      {props.genome1?.whitespotting !== undefined &&
        props.genome2?.whitespotting !== undefined && (
          <>
            whitespotting<br></br>
          </>
        )}
      {props.genome1?.growth !== undefined &&
        props.genome2?.growth !== undefined && (
          <>
            growth<br></br>
          </>
        )}
    </Box>
  );
};

export default GenomeCombo;
