// binaryvalue.ts
import { BDSingletProperty, BDArrayProperty } from "../properties/index.js";
import { BDObject } from "./generic/object.js";
import {
  ObjectType,
  ApplicationTag,
  PropertyIdentifier,
  BinaryPV,
  Polarity,
  EventState,
  Reliability,
  StatusFlagsBitString,
} from "@innovation-system/node-bacnet";

export interface BDBinaryValueOpts {
  name: string;
  description?: string;
  presentValue?: BinaryPV;
  polarity?: Polarity;
  outOfService?: boolean;
  priorityArray?: (BinaryPV | null)[];
  relinquishDefault?: BinaryPV;
}

/**
 * Implements a BACnet Binary Value object
 * 
 * The Binary Value object represents a software-based binary value that can be either
 * ACTIVE or INACTIVE. This object type provides a standard way to represent and control
 * binary states in BACnet systems, such as internal flags or software-controlled switches.
 * 
 * Required properties according to the BACnet specification:
 * - Object_Identifier (automatically added by BDObject)
 * - Object_Name (automatically added by BDObject)
 * - Object_Type (automatically added by BDObject)
 * - Present_Value (writable)
 * - Status_Flags (read-only)
 * - Event_State (read-only)
 * - Out_Of_Service
 * - Polarity
 * - Priority_Array (for writable objects)
 * - Relinquish_Default (for objects with priority array)
 * 
 * @extends BDObject
 */
export class BDBinaryValue extends BDObject {
  readonly presentValue: BDSingletProperty<ApplicationTag.ENUMERATED, BinaryPV>;
  readonly polarity: BDSingletProperty<ApplicationTag.ENUMERATED, Polarity>;
  readonly priorityArray: BDArrayProperty<ApplicationTag.ENUMERATED | ApplicationTag.NULL, BinaryPV | null>;
  readonly relinquishDefault: BDSingletProperty<ApplicationTag.ENUMERATED, BinaryPV>;

  constructor(instance: number, opts: BDBinaryValueOpts) {
    super(ObjectType.BINARY_VALUE, instance, opts.name, opts.description);

    // Initialize common properties
    this.outOfService.setValue(opts.outOfService ?? false);
    this.eventState.setValue(EventState.NORMAL);
    this.statusFlags.setValue(new StatusFlagsBitString(0));
    this.reliability.setValue(Reliability.NO_FAULT_DETECTED);

    // BinaryValue specific properties
    this.presentValue = this.addProperty(new BDSingletProperty(
      PropertyIdentifier.PRESENT_VALUE,
      ApplicationTag.ENUMERATED,
      true,
      opts.presentValue ?? BinaryPV.INACTIVE
    ));
    
    this.polarity = this.addProperty(new BDSingletProperty(
      PropertyIdentifier.POLARITY,
      ApplicationTag.ENUMERATED,
      false,
      opts.polarity ?? Polarity.NORMAL
    ));
    
    this.relinquishDefault = this.addProperty(new BDSingletProperty(
      PropertyIdentifier.RELINQUISH_DEFAULT,
      ApplicationTag.ENUMERATED,
      false,
      opts.relinquishDefault ?? BinaryPV.INACTIVE
    ));
    
    // Initialize priority array
    const initialPriorityArray = new Array(16).fill(null).map(() => ({
      type: ApplicationTag.NULL,
      value: null
    }));
    
    this.priorityArray = this.addProperty(new BDArrayProperty(
      PropertyIdentifier.PRIORITY_ARRAY,
      false,
      initialPriorityArray
    ));
    
    // Set initial priority values
    if (opts.priorityArray) {
      for (let i = 0; i < Math.min(16, opts.priorityArray.length); i++) {
        const value = opts.priorityArray[i];
        if (value !== null) {
          this.priorityArray[i] = {
            type: ApplicationTag.ENUMERATED,
            value
          };
        }
      }
    }
  }
  
  setAlarm(state: EventState, reliability: Reliability = Reliability.UNRELIABLE_OTHER): void {
    this.eventState.setValue(state);
    this.reliability.setValue(reliability);
    
    // Update status flags
    const currentFlags:any = (~0b0001 & this.statusFlags.getValue());
    const newFlags = new StatusFlagsBitString(currentFlags);
    this.statusFlags.setValue(newFlags);
  }
  
  clearAlarm(): void {
    this.eventState.setValue(EventState.NORMAL);
    this.reliability.setValue(Reliability.NO_FAULT_DETECTED);
    
    // Update status flags
    const currentFlags = this.statusFlags.getValue();
    const newFlags = new StatusFlagsBitString(~0b0001 & currentFlags.value);
    this.statusFlags.setValue(newFlags);
  }
  
  setPriorityValue(priority: number, value: BinaryPV | null): void {
    if (priority < 1 || priority > 16) {
      throw new Error('Priority must be between 1 and 16');
    }
    
    const index = priority - 1;
    this.priorityArray[index] = value !== null 
      ? { type: ApplicationTag.ENUMERATED, value } 
      : { type: ApplicationTag.NULL, value: null };
  }
}