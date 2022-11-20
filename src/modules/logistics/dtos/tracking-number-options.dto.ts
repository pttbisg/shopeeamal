import { StringEnumArrayQueryFieldOptional } from '../../../decorators';
import { TrackingInfoOptionsDto } from './tracking-info-options.dto';

enum TrackingNumberOptionalField {
  first_mile_tracking_number = 'first_mile_tracking_number',
  last_mile_tracking_number = 'last_mile_tracking_number',
}

export class TrackingNumberOptionsDto extends TrackingInfoOptionsDto {
  @StringEnumArrayQueryFieldOptional(() => TrackingNumberOptionalField)
  response_optional_fields?: TrackingNumberOptionalField[] | string;
}
