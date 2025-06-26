// // bacnet-augmentation.d.ts
// import { 
//   ApplicationTag, 
//   BinaryPV, 
//   ObjectType, 
//   EventState, 
//   EngineeringUnits, 
//   PropertyIdentifier, 
//   DeviceStatus, 
//   Segmentation, 
//   Reliability 
// } from '@innovation-system/node-bacnet';

// declare module '@innovation-system/node-bacnet' {
//   interface ApplicationTagValueTypeMap {
//     [ApplicationTag.ENUMERATED]: 
//       | ObjectType
//       | EventState
//       | EngineeringUnits
//       | PropertyIdentifier
//       | DeviceStatus
//       | Segmentation
//       | Reliability
//       | BinaryPV; // new for binary values
//   }
// }

import {
  ApplicationTag,
  BinaryPV,
  ObjectType,
  EventState,
  EngineeringUnits,
  PropertyIdentifier,
  DeviceStatus,
  Segmentation,
  Reliability
} from '@innovation-system/node-bacnet';

declare module '@innovation-system/node-bacnet' {
  type ExtendedEnumeratedTypes = 
    | ObjectType
    | EventState
    | EngineeringUnits
    | PropertyIdentifier
    | DeviceStatus
    | Segmentation
    | Reliability
    | BinaryPV;

  interface ApplicationTagValueTypeMap {
    [ApplicationTag.ENUMERATED]: ExtendedEnumeratedTypes | ((ctx: any) => ExtendedEnumeratedTypes);
  }
}