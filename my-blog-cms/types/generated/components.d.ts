import type { Schema, Struct } from '@strapi/strapi';

export interface PlanPlanPoint extends Struct.ComponentSchema {
  collectionName: 'components_plan_plan_points';
  info: {
    description: 'A feature point in a plan section (included or excluded)';
    displayName: 'Plan Point';
  };
  attributes: {
    included: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    text: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface PlanPlanSection extends Struct.ComponentSchema {
  collectionName: 'components_plan_plan_sections';
  info: {
    description: 'A section within a plan containing a title and feature points';
    displayName: 'Plan Section';
  };
  attributes: {
    points: Schema.Attribute.Component<'plan.plan-point', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
  };
}

export interface PrivacyPolicySection extends Struct.ComponentSchema {
  collectionName: 'components_privacy_policy_sections';
  info: {
    description: 'A section within the privacy policy';
    displayName: 'Policy Section';
  };
  attributes: {
    content: Schema.Attribute.RichText & Schema.Attribute.Required;
    sectionId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    description: 'A social media link with platform, URL, and display options';
    displayName: 'Social Link';
  };
  attributes: {
    icon: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    label: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    platform: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    url: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'plan.plan-point': PlanPlanPoint;
      'plan.plan-section': PlanPlanSection;
      'privacy.policy-section': PrivacyPolicySection;
      'shared.social-link': SharedSocialLink;
    }
  }
}
