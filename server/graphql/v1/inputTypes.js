import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLError,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLScalarType,
  GraphQLString,
} from 'graphql';
import { Kind } from 'graphql/language';
import GraphQLJSON from 'graphql-type-json';

import { DateString, IsoDateString } from './types';

const EmailType = new GraphQLScalarType({
  name: 'Email',
  serialize: value => {
    return value;
  },
  parseValue: value => {
    return value;
  },
  parseLiteral: ast => {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(`Query error: Can only parse strings got a: ${ast.kind}`);
    }

    // Regex taken from: http://stackoverflow.com/a/46181/761555
    const re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if (!re.test(ast.value)) {
      throw new GraphQLError(`Query error: Not a valid Email ${[ast]}`);
    }

    return ast.value;
  },
});

export const PaymentMethodInputType = new GraphQLInputObjectType({
  name: 'PaymentMethodInputType',
  description: 'Input type for PaymentMethod (paypal/stripe)',
  fields: () => ({
    id: { type: GraphQLInt },
    uuid: { type: GraphQLString }, // used to fetch an existing payment method
    token: { type: GraphQLString },
    service: { type: GraphQLString },
    type: {
      type: GraphQLString,
      description: 'creditcard, giftcard, prepaid, manual...',
    },
    customerId: { type: GraphQLString },
    data: { type: GraphQLJSON },
    name: { type: GraphQLString },
    primary: { type: GraphQLBoolean },
    monthlyLimitPerMember: { type: GraphQLInt },
    currency: { type: GraphQLString },
    save: { type: GraphQLBoolean },
  }),
});

const CustomFieldType = new GraphQLEnumType({
  name: 'CustomFieldType',
  description: 'Type of custom field',
  values: {
    number: {},
    text: {},
    email: {},
    date: {},
    radio: {},
    url: {},
  },
});

export const CustomFieldsInputType = new GraphQLInputObjectType({
  name: 'CustomFieldsInputType',
  description: 'Input for custom fields for order',
  fields: () => ({
    type: { type: CustomFieldType },
    name: { type: GraphQLString },
    label: { type: GraphQLString },
    required: { type: GraphQLBoolean },
  }),
});

export const StripeCreditCardDataInputType = new GraphQLInputObjectType({
  name: 'StripeCreditCardDataInputType',
  description: 'Input for stripe credit card data',
  fields: () => ({
    fullName: { type: GraphQLString },
    expMonth: { type: GraphQLInt },
    expYear: { type: GraphQLInt },
    brand: { type: GraphQLString },
    country: { type: GraphQLString },
    funding: { type: GraphQLString },
    zip: { type: GraphQLString },
  }),
});

export const UserInputType = new GraphQLInputObjectType({
  name: 'UserInputType',
  description: 'Input type for UserType',
  fields: () => ({
    id: { type: GraphQLInt },
    email: { type: EmailType },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    name: { type: GraphQLString },
    company: { type: GraphQLString },
    image: { type: GraphQLString },
    username: { type: GraphQLString },
    description: { type: GraphQLString },
    twitterHandle: { type: GraphQLString },
    githubHandle: { type: GraphQLString },
    website: { type: GraphQLString },
    paypalEmail: { type: GraphQLString, deprecationReason: '2020-01-21: Replaced by PayoutMethods' },
    newsletterOptIn: { type: GraphQLBoolean },
    location: { type: LocationInputType },
  }),
});

export const MemberInputType = new GraphQLInputObjectType({
  name: 'MemberInputType',
  description: 'Input type for MemberType',
  fields: () => ({
    id: { type: GraphQLInt },
    member: { type: CollectiveAttributesInputType },
    collective: { type: CollectiveAttributesInputType },
    role: { type: GraphQLString },
    description: { type: GraphQLString },
    since: { type: DateString },
  }),
});

export const NotificationInputType = new GraphQLInputObjectType({
  name: 'NotificationInputType',
  description: 'Input type for NotificationType',
  fields: () => ({
    id: { type: GraphQLInt },
    type: { type: new GraphQLNonNull(GraphQLString) },
    webhookUrl: { type: GraphQLString },
  }),
});

export const CollectiveInputType = new GraphQLInputObjectType({
  name: 'CollectiveInputType',
  description: 'Input type for CollectiveType',
  fields: () => ({
    id: { type: GraphQLInt },
    slug: { type: GraphQLString },
    type: { type: GraphQLString },
    name: { type: GraphQLString },
    company: { type: GraphQLString },
    website: { type: GraphQLString },
    twitterHandle: { type: GraphQLString },
    githubHandle: { type: GraphQLString },
    description: { type: GraphQLString },
    longDescription: { type: GraphQLString },
    expensePolicy: { type: GraphQLString },
    location: { type: LocationInputType },
    startsAt: { type: GraphQLString },
    endsAt: { type: GraphQLString },
    timezone: { type: GraphQLString },
    currency: { type: GraphQLString },
    image: { type: GraphQLString },
    backgroundImage: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
    tiers: { type: new GraphQLList(TierInputType) },
    settings: { type: GraphQLJSON },
    data: { type: GraphQLJSON, deprecationReason: '2020-10-08: data cannot be edited. This field will be ignored.' },
    members: { type: new GraphQLList(MemberInputType) },
    notifications: { type: new GraphQLList(NotificationInputType) },
    HostCollectiveId: { type: GraphQLInt },
    hostFeePercent: { type: GraphQLInt },
    ParentCollectiveId: { type: GraphQLInt },
    // not very logical to have this here. Might need some refactoring. Used to add/edit members and to create a new user on a new order
    email: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    isIncognito: { type: GraphQLBoolean },
    isActive: { type: GraphQLBoolean },
    contributionPolicy: { type: GraphQLString },
  }),
});

export const ConnectedAccountInputType = new GraphQLInputObjectType({
  name: 'ConnectedAccountInputType',
  description: 'Input type for ConnectedAccountInputType',
  fields: () => ({
    id: { type: GraphQLInt },
    settings: { type: GraphQLJSON },
  }),
});

export const CollectiveAttributesInputType = new GraphQLInputObjectType({
  name: 'CollectiveAttributesInputType',
  description: 'Input type for attributes of CollectiveInputType',
  fields: () => ({
    id: { type: GraphQLInt },
    slug: { type: GraphQLString },
    type: { type: GraphQLString },
    name: { type: GraphQLString },
    company: { type: GraphQLString },
    firstName: { type: GraphQLString }, // for Collective type USER
    lastName: { type: GraphQLString }, // for Collective type USER
    email: { type: GraphQLString }, // for Collective type USER
    description: { type: GraphQLString },
    longDescription: { type: GraphQLString },
    expensePolicy: { type: GraphQLString },
    website: { type: GraphQLString },
    twitterHandle: { type: GraphQLString },
    githubHandle: { type: GraphQLString },
    location: { type: LocationInputType },
    startsAt: { type: GraphQLString },
    endsAt: { type: GraphQLString },
    timezone: { type: GraphQLString },
    currency: { type: GraphQLString },
    settings: { type: GraphQLJSON },
    isIncognito: { type: GraphQLBoolean },
    tags: { type: new GraphQLList(GraphQLString) },
    contributionPolicy: { type: GraphQLString },
  }),
});

export const LocationInputType = new GraphQLInputObjectType({
  name: 'LocationInputType',
  description: 'Input type for Location',
  fields: () => ({
    name: {
      type: GraphQLString,
      description: 'A short name for the location (eg. Google Headquarters)',
    },
    address: {
      type: GraphQLString,
      description: 'Postal address without country (eg. 12 opensource avenue, 7500 Paris)',
    },
    country: {
      type: GraphQLString,
      description: 'Two letters country code (eg. FR, BE...etc)',
    },
    lat: {
      type: GraphQLFloat,
      description: 'Latitude',
    },
    long: {
      type: GraphQLFloat,
      description: 'Longitude',
    },
  }),
});

export const TierInputType = new GraphQLInputObjectType({
  name: 'TierInputType',
  description: 'Input type for TierType',
  fields: () => ({
    id: { type: GraphQLInt },
    type: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    longDescription: {
      type: GraphQLString,
      description: 'A long, html-formatted description.',
    },
    useStandalonePage: {
      type: GraphQLBoolean,
      description: 'Whether this tier has a standalone page',
    },
    videoUrl: {
      type: GraphQLString,
      description: 'Link to a video (YouTube, Vimeo).',
    },
    amount: {
      type: GraphQLInt,
      description: 'amount in the lowest unit of the currency of the host (ie. in cents)',
    },
    button: {
      type: GraphQLString,
      description: 'Button text',
    },
    currency: { type: GraphQLString },
    presets: { type: new GraphQLList(GraphQLInt) },
    interval: { type: GraphQLString },
    maxQuantity: { type: GraphQLInt },
    minimumAmount: { type: GraphQLInt },
    amountType: { type: GraphQLString },
    goal: {
      type: GraphQLInt,
      description: 'amount that you are trying to raise with this tier',
    },
    customFields: { type: new GraphQLList(CustomFieldsInputType) },
    startsAt: {
      type: GraphQLString,
      description: 'Start of the campaign',
    },
    endsAt: {
      type: GraphQLString,
      description: 'End of the campaign',
    },
  }),
});

export const GuestInfoInput = new GraphQLInputObjectType({
  name: 'GuestInfoInput',
  description: 'Input type for guest contributions',
  fields: {
    email: {
      type: GraphQLString,
      description: "Contributor's email",
    },
    name: {
      type: GraphQLString,
      description: 'Full name of the user',
    },
    token: {
      type: GraphQLString,
      description: 'The unique guest token',
    },
  },
});

export const OrderInputType = new GraphQLInputObjectType({
  name: 'OrderInputType',
  description: 'Input type for OrderType',
  fields: () => ({
    id: { type: GraphQLInt },
    quantity: {
      type: GraphQLInt,
      defaultValue: 1,
    },
    totalAmount: { type: GraphQLInt },
    hostFeePercent: { type: GraphQLFloat },
    platformFeePercent: { type: GraphQLInt },
    platformFee: { type: GraphQLInt },
    isFeesOnTop: { type: GraphQLBoolean },
    currency: { type: GraphQLString },
    interval: { type: GraphQLString },
    description: { type: GraphQLString },
    publicMessage: { type: GraphQLString },
    privateMessage: { type: GraphQLString },
    paymentMethod: { type: PaymentMethodInputType },
    user: { type: UserInputType, deprecationReason: '2020-10-13: This field is now ignored' },
    fromCollective: { type: CollectiveAttributesInputType },
    collective: { type: new GraphQLNonNull(CollectiveAttributesInputType) },
    tier: { type: TierInputType },
    customData: { type: GraphQLJSON },
    recaptchaToken: { type: GraphQLString },
    guestInfo: {
      type: GuestInfoInput,
      description: 'Use this when fromAccount is null to pass the guest info',
    },
    // For taxes
    taxAmount: {
      type: GraphQLInt,
      description: 'The amount of taxes that were included in totalAmount',
      defaultValue: 0,
    },
    countryISO: {
      type: GraphQLString,
      description: 'User country, to know which tax applies',
    },
    taxIDNumber: {
      type: GraphQLString,
      description: 'User tax ID number',
    },
  }),
});

export const ConfirmOrderInputType = new GraphQLInputObjectType({
  name: 'ConfirmOrderInputType',
  description: 'Input type for ConfirmOrderType',
  fields: () => ({
    id: { type: GraphQLInt },
  }),
});

export const CommentInputType = new GraphQLInputObjectType({
  name: 'CommentInputType',
  description: 'Input type for CommentType',
  deprecationReason: 'Comments are now fully supported by API V2',
  fields: () => ({
    id: { type: GraphQLInt },
    markdown: { type: GraphQLString, deprecationReason: 'Markdown editor is deprecated, please use html instead.' },
    html: { type: GraphQLString },
    FromCollectiveId: {
      type: GraphQLInt,
      description: 'Not supported yet. Defaults to user collective ID.',
    },
    CollectiveId: {
      type: GraphQLInt,
      deprecationReason:
        '2019-11-28: This field is not used by the query. Collective ID is automatically guessed from linked entity (expense, update or conversation)',
    },
    ExpenseId: {
      type: GraphQLInt,
      deprecationReason: '2020-03-18: Comments on expenses must use API V2',
    },
    UpdateId: {
      type: GraphQLInt,
      deprecationReason: '2020-03-18: Comments on updates are not yet supported',
    },
    ConversationId: {
      type: GraphQLInt,
      deprecationReason: '2020-03-18: Comments on conversations must use API V2',
    },
  }),
});

export const CommentAttributesInputType = new GraphQLInputObjectType({
  name: 'CommentAttributesInputType',
  description: 'Input type for CommentType',
  fields: () => ({
    id: { type: GraphQLInt },
    markdown: {
      deprecationReason: 'Deprecated since 2020-03-18: Please use html.',
      type: GraphQLString,
    },
    html: { type: GraphQLString },
    UpdateId: {
      deprecationReason: 'Deprecated since 2020-03-18: This field has never been active and will be removed soon.',
      type: GraphQLInt,
    },
  }),
});

export const UpdateInputType = new GraphQLInputObjectType({
  name: 'UpdateInputType',
  description: 'Input type for UpdateType',
  fields: () => ({
    id: { type: GraphQLInt },
    views: { type: GraphQLInt },
    slug: { type: GraphQLString },
    title: { type: GraphQLString },
    image: { type: GraphQLString },
    isPrivate: { type: GraphQLBoolean },
    makePublicOn: { type: IsoDateString },
    markdown: { type: GraphQLString, deprecationReason: '2021-01-25: Please use html' },
    html: { type: GraphQLString },
    fromCollective: { type: CollectiveAttributesInputType },
    collective: { type: new GraphQLNonNull(CollectiveAttributesInputType) },
    tier: { type: TierInputType },
  }),
});

export const UpdateAttributesInputType = new GraphQLInputObjectType({
  name: 'UpdateAttributesInputType',
  description: 'Input type for UpdateType',
  fields: () => ({
    id: { type: GraphQLInt },
    views: { type: GraphQLInt },
    slug: { type: GraphQLString },
    title: { type: GraphQLString },
    image: { type: GraphQLString },
    isPrivate: { type: GraphQLBoolean },
    makePublicOn: { type: IsoDateString },
    markdown: { type: GraphQLString, deprecationReason: '2021-01-25: Please use html' },
    html: { type: GraphQLString },
    fromCollective: { type: CollectiveAttributesInputType },
    tier: { type: TierInputType },
  }),
});

export const InvoiceInputType = new GraphQLInputObjectType({
  name: 'InvoiceInputType',
  description: 'Input dates and collectives for Invoice',
  fields: () => {
    return {
      dateFrom: { type: IsoDateString },
      dateTo: { type: IsoDateString },
      collectiveSlug: { type: GraphQLString },
      fromCollectiveSlug: { type: GraphQLString },
    };
  },
});
