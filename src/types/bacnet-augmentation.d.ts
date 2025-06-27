// bacnet-augmentation.d.ts
import {
  ApplicationTag,
  BinaryPV,
  ObjectType,
  EventState,
  EngineeringUnits,
  PropertyIdentifier,
  DeviceStatus,
  Segmentation,
  Reliability,
  Polarity
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
    | BinaryPV
    | Polarity;

  interface ApplicationTagValueTypeMap {
    [ApplicationTag.ENUMERATED]: ExtendedEnumeratedTypes | ((ctx: any) => ExtendedEnumeratedTypes);
  }
}