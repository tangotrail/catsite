import React, { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import BiotechIcon from "@mui/icons-material/Biotech";
import Chip from "@mui/material/Chip";

import * as GT from "./GeneticsTypes";

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
    setFields(
      genomeString.length !== 0
        ? genomeString.replace(/[[\]]/g, "").split("-")
        : []
    );
  }, [genomeString]);

  useEffect(() => {
    setVisible([true, true, true, true, true, true, true]);
  }, [fields]);

  useEffect(() => {
    setGenome(parse());
  }, [visible]);

  useEffect(() => {
    setPhenotype(decipher());
    props.onChange(genome);
  }, [genome]);

  const parse = (): GT.Genome => {
    let gen: GT.Genome = {};

    gen.species = fields[0] as GT.Species;
    if (fields.length > 1)
      gen.wind = fields[1].split("|").map((item) => item as GT.Wind);

    if (fields.length > 2)
      gen.furtype = fields[2].split("|").map((item) => item as GT.Furtype);

    if (fields.length > 3) {
      const tokens: string[] = fields[3].split("|");
      gen.color = tokens.slice(0, 4).map((item) => item as GT.Color);
      gen.color.push(Number.parseInt(tokens[4]));
    }

    if (fields.length > 4)
      gen.pattern = fields[4].split("|").map((item) => item as GT.Pattern);

    if (fields.length > 5) {
      const tokens: string[] = fields[5].split("|");

      gen.whitespotting = tokens
        .slice(0, 2)
        .map((item) => item as GT.Whitespotting);
      gen.whitespotting.push(Number.parseInt(tokens[2]));
      gen.whitespotting.push(tokens[3] as GT.Whitespotting);
    }

    if (fields.length > 6)
      gen.growth = fields[6].split("|").map((item) => item as GT.Growth);

    return gen;
  };

  const decipher = (): string[] => {
    let pheno: string[] = [];

    if (genome.species !== undefined) {
      if (genome.species === GT.Species.NOTCAT) pheno.push("Not-cat");
      else pheno.push("");
    }

    if (genome.wind !== undefined) {
      const windSet: Set<GT.Wind> = new Set(genome.wind);
      if (windSet.has(GT.Wind.NORTH) && windSet.has(GT.Wind.SOUTH))
        pheno.push("Trade");
      else if (windSet.has(GT.Wind.NORTH)) pheno.push("North");
      else if (windSet.has(GT.Wind.SOUTH)) pheno.push("South");
      else if (windSet.has(GT.Wind.NULL)) pheno.push("Null");
      else pheno.push("");
    }

    if (genome.furtype !== undefined) {
      const furSet: Set<GT.Furtype> = new Set(genome.furtype);
      if (furSet.has(GT.Furtype.SHORT)) pheno.push("Shorthair");
      else if (furSet.has(GT.Furtype.LONG)) pheno.push("Longhair");
      else pheno.push("");
    }

    if (genome.color !== undefined && genome.wind !== undefined) {
      const wind: GT.Wind = pheno[1] as GT.Wind;
      let mapKey: [GT.Color, GT.Color, number] = [
        genome.color[0] as GT.Color,
        GT.Color.DILUTE,
        genome.color[4] as number,
      ];
      let colorType = "Standard";
      // color group
      if (wind === GT.Wind.SOUTH) mapKey[0] = genome.color[1] as GT.Color;
      else if (wind === GT.Wind.TRADE) {
        mapKey[0] = genome.color[0] as GT.Color;
        if (genome.color[0] !== genome.color[1]) colorType = "Tortoiseshell";
        else colorType = "Watercolor";
      }

      // full vs dilute
      const shadeSet: Set<GT.Color | number> = new Set(
        genome.color.slice(2, 4)
      );
      if (shadeSet.has(GT.Color.FULL)) mapKey[1] = GT.Color.FULL;

      let colorString = GT.colorMap.get(mapKey.join(", "));
      if (colorString !== undefined) {
        pheno.push(`${colorString} ${colorType}`);
      } else pheno.push("");
    }

    if (genome.pattern !== undefined) {
      if (
        genome.pattern[0] === GT.Pattern.NO &&
        genome.pattern[1] === GT.Pattern.NO
      )
        visible[4] = false;

      const mapValue = GT.patternMap.get(genome.pattern.slice(2, 4).join(", "));
      pheno.push(mapValue !== undefined ? mapValue : "");
    }

    if (genome.whitespotting !== undefined) {
      if (
        genome.whitespotting[0] === GT.Whitespotting.NO &&
        genome.whitespotting[1] === GT.Whitespotting.NO
      )
        visible[5] = false;

      const mapValue = GT.whitespottingMap.get(
        genome.whitespotting[2] as number
      );
      pheno.push(mapValue !== undefined ? mapValue : "");
    }

    if (genome.growth !== undefined) {
      const mapKey = `${genome.growth[0]}, ${genome.growth[1]}`;
      const mapValue = GT.growthMap.get(mapKey);
      if (mapValue !== undefined) pheno.push(mapValue);
      else pheno.push("");
    }

    // null
    if (
      (pheno.length > 1 && pheno[1] === "Null") ||
      (pheno.length > 5 && pheno[5] === "Albino" && visible[5])
    ) {
      visible[3] = false;
      visible[4] = false;
      if (pheno.length > 1 && pheno[1] === "Null") visible[5] = false;
    }

    return pheno;
  };

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
          {fields.map((item, index) => (
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
                {phenotype.length > index && GT.Traits[index]}
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
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default GenomeParser;
