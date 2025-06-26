//binaryvalue.ts
import { BDSingletProperty } from "../properties/index.js";
import { BDObject } from "./generic/object.js";
import {
  ObjectType,
  ApplicationTag,
  PropertyIdentifier,
  // EngineeringUnits, //BI,BO,BV has no EngineeringUnits
  BinaryPV,
} from "@innovation-system/node-bacnet";

export interface BDBinaryValueOpts {
  name: string;
  // unit: EngineeringUnits,
  description?: string;
  presentValue?: BinaryPV;
}

// export class BDBinaryValue extends BDObject {
//   // readonly presentValue: BDSingletProperty<ApplicationTag.ENUMERATED, BinaryPV>;
//   readonly presentValue: BDSingletProperty<ApplicationTag.ENUMERATED, any>;

//   constructor(instance: number, opts: BDBinaryValueOpts) {
//     super(ObjectType.BINARY_VALUE, instance, opts.name, opts.description);

//     // this.presentValue = this.addProperty(new BDSingletProperty(
//     //   PropertyIdentifier.PRESENT_VALUE,
//     //   ApplicationTag.ENUMERATED,
//     //   true,
//     //   opts.presentValue ?? BinaryPV.INACTIVE));

//     this.presentValue = this.addProperty(
//       new BDSingletProperty(
//         PropertyIdentifier.PRESENT_VALUE,
//         ApplicationTag.ENUMERATED,
//         true,
//         opts.presentValue ?? BinaryPV.INACTIVE
//       ) as any
//     );
//   }
// }


export class BDBinaryValue extends BDObject {
  readonly presentValue: BDSingletProperty<ApplicationTag.ENUMERATED, any>;
  constructor(instance: number, opts: BDBinaryValueOpts) {
    super(ObjectType.BINARY_VALUE, instance, opts.name, opts.description);

    // Füge einen expliziten Cast hinzu
    const initialValue = (opts.presentValue ?? BinaryPV.INACTIVE) as any;
    
    this.presentValue = this.addProperty(new BDSingletProperty(
      PropertyIdentifier.PRESENT_VALUE,
      ApplicationTag.ENUMERATED,
      true,
      initialValue
    ));
  }
}