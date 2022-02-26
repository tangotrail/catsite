import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import BiotechIcon from "@mui/icons-material/Biotech";
import Chip from "@mui/material/Chip";

import * as GT from "./GeneticsTypes";
import * as GL from "./GeneticsLogic";

interface GenomeParserProps {
  onChange: any;
}

const GenomeParser = (props: GenomeParserProps) => {
  const [genomeString, setGenomeString] = useState("");
  const [fields, setFields] = useState<string[]>([]);
  const [visible, setVisible] = useState<boolean[]>([]);
  const [genome, setGenome] = useState<GT.Genome>({});
  const [phenotype, setPhenotype] = useState<string[]>([]);

  useEffect(() => {
    const genomeResults: [GT.Genome, string[]] = GL.stringToGenome(genomeString);
    setGenome(genomeResults[0]);
    setFields(genomeResults[1]);
  }, [genomeString]);

  useEffect(() => {
    const phenoResults: [string[], boolean[]] = GL.genomeToPhenotype(genome);
    setPhenotype(phenoResults[0]);
    setVisible(phenoResults[1]);
    props.onChange(genome);
  }, [genome]);

  return (
    <Box className="GenomeParser">
      <Grid sx={{ display: "flex", alignItems: "flex-end" }}>
        <BiotechIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
        <Box sx={{ minWidth: "100%" }}>
          <TextField
            fullWidth
            label="Genetic string"
            variant="standard"
            value={genomeString}
            onChange={(e) => setGenomeString(e.target.value)}
          />
        </Box>
      </Grid>
      {fields.length !== 0 && (
        <Grid container>
          {fields.map((item, index) => {
            if (index >= Object.keys(GT.Trait).length) return <></>;
            return (
              <>
                <Grid
                  xs={2}
                  md={4}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: ".5em",
                  }}
                >
                  <Chip
                    label={item}
                    size="small"
                    className={visible[index] ? "visibleGenes" : "hiddenGenes"}
                  />
                </Grid>
                <Grid
                  xs={5}
                  md={4}
                  sx={{
                    marginTop: ".5em",
                    textAlign: "right",
                    paddingRight: "1em",
                  }}
                  className="bold"
                >
                  {phenotype.length > index && Object.values(GT.Trait)[index]}
                </Grid>
                <Grid
                  xs={5}
                  md={4}
                  sx={{ marginTop: ".5em" }}
                  className={visible[index] ? "visiblePheno" : "hiddenPheno"}
                >
                  {phenotype.length > index && phenotype[index]}
                </Grid>
              </>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default GenomeParser;
