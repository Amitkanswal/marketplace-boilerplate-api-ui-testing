import allFieldsComplexCustomField from "./all-fields-complex-custom-field.json";
import allFieldsComplex from "./all-fields-complex.json";
import booleanField from "./boolean-field.json";
import customExtensionField from "./custom-extension-field.json";
import dateField from "./date-field.json";
import extensionFieldInGroup from "./extension-field-in-group.json";
import extensionFieldInModularBlocks from "./extension-field-in-modular-blocks.json";
import fieldModifierSetdata from "./field-modifier-setdata.json";
import fieldModifierSetdataInGroup from "./field-modifier-setdata-in-group.json";
import fileField from "./file-field.json";
import globalFieldComplex from "./global-field-complex.json";
import groupFieldComplex from "./group-field-complex.json";
import jsonRteField from "./json-rte-field.json";
import linkField from "./link-field.json";
import numberField from "./number-field.json";
import referenceField from "./reference-field.json";
import selectField from "./select-field.json";
import taxonomyField from "./taxonomy-field.json";
import textConstrained from "./text-constrained.json";
import textInGlobalField from "./text-in-global-field.json";
import textInGroup from "./text-in-group.json";
import textInModularBlocks from "./text-in-modular-blocks.json";
import textInRepeatableGroup from "./text-in-repeatable-group.json";
import textMultiple from "./text-multiple.json";
import textNestedGroups from "./text-nested-groups.json";

export const allModules = [
  textMultiple,
  textConstrained,
  textInGroup,
  textInRepeatableGroup,
  textInModularBlocks,
  textInGlobalField,
  textNestedGroups,
  numberField,
  booleanField,
  dateField,
  fileField,
  linkField,
  referenceField,
  selectField,
  groupFieldComplex,
  globalFieldComplex,
  customExtensionField,
  extensionFieldInGroup,
  extensionFieldInModularBlocks,
  fieldModifierSetdata,
  fieldModifierSetdataInGroup,
  taxonomyField,
  jsonRteField,
  allFieldsComplex,
  allFieldsComplexCustomField,
] as const;

export type TestModule = (typeof allModules)[number];
