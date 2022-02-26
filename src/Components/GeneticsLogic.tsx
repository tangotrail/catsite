import * as GT from "./GeneticsTypes";

const blank = "";

export const stringToGenome = (genomeString: string): [GT.Genome, string[]] => {
  const fields: string[] =
    genomeString.length !== 0 ? genomeString.replace(/[[\]]/g, "").split("-") : [];
  let gen: GT.Genome = {};

  gen.species = [fields[0] as GT.Species];
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

    gen.whitespotting = tokens.slice(0, 2).map((item) => item as GT.Whitespotting);
    gen.whitespotting.push(Number.parseInt(tokens[2]));
    gen.whitespotting.push(tokens[3] as GT.Whitespotting);
  }

  if (fields.length > 6)
    gen.growth = fields[6].split("|").map((item) => item as GT.Growth);

  return [gen, fields];
};

export const genomeToPhenotype = (genome: GT.Genome): [string[], boolean[]] => {
  let pheno: string[] = [];
  let visible: boolean[] = [true, true, true, true, true, true, true];

  for (let i = 0; i < Object.keys(GT.Trait).length; i++) {
    const traitString: string = Object.values(GT.Trait)
      [i].toLowerCase()
      .replace(" ", "");
    const genes: GT.Gene[] = genome[traitString as keyof GT.Genome] as GT.Gene[];
    const trait: GT.Trait =
      GT.Trait[Object.keys(GT.Trait)[i] as keyof typeof GT.Trait];
    pheno.push(genes !== undefined ? geneToPhenotype(trait, genes) : blank);
  }

  // fix color based on wind
  if (pheno.length > 3 && pheno[3] !== blank && genome.color !== undefined) {
    const wind: GT.Wind = GT.Wind[pheno[1].toUpperCase() as keyof typeof GT.Wind];
    pheno[3] = colorPhenotype(wind, genome.color);
  }

  // adjust color group (std, water, tortoise)
  if (pheno.length > 3 && pheno[3] !== blank && genome.color !== undefined) {
    const wind: GT.Wind = pheno[1] as GT.Wind;
    let colorType = "Standard";
    if (wind === GT.Wind.TRADE) {
      if (genome.color[0] !== genome.color[1]) colorType = "Tortoiseshell";
      else colorType = "Watercolor";
    }
    pheno[3] = pheno[3] + " " + colorType;
  }

  // adjust visibility for pattern
  if (pheno.length > 4 && pheno[4] !== blank && genome.pattern !== undefined) {
    if (genome.pattern[0] === GT.Pattern.NO && genome.pattern[1] === GT.Pattern.NO)
      visible[4] = false;
  }

  // adjust visibility for whitespotting
  if (pheno.length > 5 && pheno[5] !== blank && genome.whitespotting !== undefined) {
    if (
      genome.whitespotting[0] === GT.Whitespotting.NO &&
      genome.whitespotting[1] === GT.Whitespotting.NO
    )
      visible[5] = false;
  }

  // adjust visibility for albino + null
  if (
    (pheno.length > 1 && pheno[1] === "Null") ||
    (pheno.length > 5 && pheno[5] === "Albino" && visible[5])
  ) {
    visible[3] = false;
    visible[4] = false;
    if (pheno.length > 1 && pheno[1] === "Null") visible[5] = false;
  }
  return [pheno, visible];
};

export const geneToPhenotype = (trait: GT.Trait, genes: GT.Gene[]): string => {
  if (trait === GT.Trait.SPECIES) {
    const species = genes[0] as GT.Species;
    if (species === GT.Species.NOTCAT) return "Not-cat";
    else return blank;
  }

  if (trait === GT.Trait.WIND) {
    const windSet: Set<GT.Wind> = new Set(genes.map((gene) => gene as GT.Wind));
    if (windSet.has(GT.Wind.NORTH) && windSet.has(GT.Wind.SOUTH)) return "Trade";
    else if (windSet.has(GT.Wind.NORTH)) return "North";
    else if (windSet.has(GT.Wind.SOUTH)) return "South";
    else if (windSet.has(GT.Wind.NULL)) return "Null";
    else return blank;
  }

  if (trait === GT.Trait.FURTYPE) {
    const furSet: Set<GT.Furtype> = new Set(genes.map((gene) => gene as GT.Furtype));
    if (furSet.has(GT.Furtype.SHORT)) return "Shorthair";
    else if (furSet.has(GT.Furtype.LONG)) return "Longhair";
    else return blank;
  }

  if (trait === GT.Trait.COLOR) {
    const mapKey: [GT.Color, GT.Color, number] = [
      genes[0] as GT.Color,
      GT.Color.DILUTE,
      genes[4] as number,
    ];

    // full vs dilute
    const shadeSet: Set<GT.Color | number> = new Set(
      genes.map((gene) => gene as GT.Color | number).slice(2, 4)
    );
    if (shadeSet.has(GT.Color.FULL)) mapKey[1] = GT.Color.FULL;

    let colorString = GT.colorMap.get(mapKey.join(", "));
    if (colorString !== undefined) return colorString;
    else return blank;
  }

  if (trait === GT.Trait.PATTERN) {
    const mapValue = GT.patternMap.get(
      genes
        .map((gene) => gene as GT.Pattern)
        .slice(2, 4)
        .join(", ")
    );
    return mapValue !== undefined ? mapValue : blank;
  }

  if (trait === GT.Trait.WHITESPOTTING) {
    const mapValue = GT.whitespottingMap.get(genes[2] as number);
    return mapValue !== undefined ? mapValue : blank;
  }

  if (trait === GT.Trait.GROWTH) {
    const mapKey = `${genes[0]}, ${genes[1]}`;
    const mapValue = GT.growthMap.get(mapKey);
    return mapValue !== undefined ? mapValue : blank;
  }

  return blank;
};

export const colorPhenotype = (wind: GT.Wind, genes: GT.Gene[]): string => {
  const mapKey: [GT.Color, GT.Color, number] = [
    wind === GT.Wind.SOUTH ? (genes[1] as GT.Color) : (genes[0] as GT.Color),
    GT.Color.DILUTE,
    genes[4] as number,
  ];

  // full vs dilute
  const shadeSet: Set<GT.Color | number> = new Set(
    genes.map((gene) => gene as GT.Color | number).slice(2, 4)
  );
  if (shadeSet.has(GT.Color.FULL)) mapKey[1] = GT.Color.FULL;

  let colorString = GT.colorMap.get(mapKey.join(", "));
  if (colorString !== undefined) return colorString;
  else return blank;
};

export const combineGenomes = (
  g1: GT.Genome,
  g2: GT.Genome
): Array<Array<GT.Gene[]>> => {
  const combo: Array<Array<GT.Gene[]>> = [];

  if (
    g1.species !== undefined &&
    g2.species !== undefined &&
    g1.species[0] === g2.species[0]
  )
    combo.push([g1.species]);
  else combo.push([]);

  if (g1.wind !== undefined && g2.wind !== undefined) {
    combo.push(combineMendelian(g1.wind, g2.wind));
  } else combo.push([]);

  if (g1.furtype !== undefined && g2.furtype !== undefined) {
    combo.push(combineMendelian(g1.furtype, g2.furtype));
  } else combo.push([]);

  if (g1.color !== undefined && g2.color !== undefined) {
    const out: Array<Array<GT.Gene>> = [];
    const colorOptions: Array<GT.Gene[]> = combineMendelian(
      g1.color.slice(0, 2),
      g2.color.slice(0, 2)
    );
    const shadeOptions: Array<GT.Gene[]> = combineMendelian(
      g1.color.slice(2, 4),
      g2.color.slice(2, 4)
    );
    const saturationOptions: Array<GT.Gene> = combineRange(g1.color[4], g2.color[4]);

    for (const color of colorOptions)
      for (const shade of shadeOptions)
        for (const saturation of saturationOptions)
          out.push(color.concat(shade, saturation));
    combo.push(out);
  } else combo.push([]);

  if (g1.pattern !== undefined && g2.pattern !== undefined) {
    const out: Array<Array<GT.Gene>> = [];
    const visibilityOptions: Array<GT.Gene[]> = combineMendelian(
      g1.pattern.slice(0, 2),
      g2.pattern.slice(0, 2)
    );
    const patternOptions: Array<GT.Gene[]> = combineMendelian(
      g1.pattern.slice(2, 4),
      g2.pattern.slice(2, 4)
    );

    for (const visibility of visibilityOptions)
      for (const p of patternOptions) out.push(visibility.concat(p));
    combo.push(out);
  } else combo.push([]);

  if (g1.whitespotting !== undefined && g2.whitespotting !== undefined) {
    const out: Array<Array<GT.Gene>> = [];
    const visibilityOptions: Array<GT.Gene[]> = combineMendelian(
      g1.whitespotting.slice(0, 2),
      g2.whitespotting.slice(0, 2)
    );
    const saturationOptions: Array<GT.Gene> = combineRange(
      g1.whitespotting[2],
      g2.whitespotting[2]
    );

    for (const visibility of visibilityOptions)
      for (const saturation of saturationOptions)
        out.push(visibility.concat(saturation, "C" as GT.Whitespotting));
    combo.push(out);
  } else combo.push([[]]);

  if (g1.growth !== undefined && g2.growth !== undefined) {
    combo.push(combineMendelian(g1.growth, g2.growth));
  } else combo.push([[]]);

  return combo;
};

export interface PossiblePheno {
  prob: number;
  pheno: string;
}

export const genesToPossiblePhenos = (
  trait: GT.Trait,
  possibleGenes: Array<GT.Gene[]>
): Array<PossiblePheno> => {
  const phenos: string[] = possibleGenes.map((genes) =>
    geneToPhenotype(trait, genes)
  );
  const totalPhenos = phenos.length;
  const possibilities: Array<PossiblePheno> = [];

  const uniquePhenos: Set<string> = new Set(phenos);
  uniquePhenos.forEach((pheno) => {
    const probability = phenos.filter((p) => p === pheno).length / totalPhenos;
    possibilities.push({ prob: probability, pheno: pheno });
  });
  possibilities.sort((a, b) => (a.prob < b.prob ? 1 : a.prob > b.prob ? -1 : 0));
  return possibilities;
};

// returns all possible allele combos
export const combineMendelian = (
  genes1: GT.Gene[],
  genes2: GT.Gene[]
): Array<GT.Gene[]> => {
  const combos: Array<GT.Gene[]> = [];
  for (const a1 of genes1) {
    for (const a2 of genes2) {
      combos.push([a1, a2]);
    }
  }
  return combos;
};

export const combineRange = (num1: GT.Gene, num2: GT.Gene): Array<GT.Gene> => {
  const combos: Array<GT.Gene> = [];
  for (
    let i = Math.min(num1 as number, num2 as number);
    i <= Math.max(num1 as number, num2 as number);
    i++
  )
    combos.push(i);
  return combos;
};
