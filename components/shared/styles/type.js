import styled from 'react-emotion';
import { UI } from './colors';
import Spacing from './spacing';

const UIFontStack =
  'Inter UI, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol';
const BangersFontStack =
  'Bangers, -apple-system, BlinkMacSystemFont, "Comic Sans MS", cursive, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol';

const Size = {
  XXLarge: 120,
  XLarge: 80,
  Large: 32,
  Medium: 24,
  Default: 16,
  Small: 14,
};

const Weight = {
  Normal: 400,
  Medium: 500,
  Bold: 700,
};

const TextOutline = `-1px -1px 0 ${UI.Text.Dark},
  1px -1px 0 ${UI.Text.Dark},
  -1px 1px 0 ${UI.Text.Dark},
  1px 1px 0 ${UI.Text.Dark}`;

const TextOutlineBig = `-2px -2px 0 ${UI.Text.Dark},
  2px -2px 0 ${UI.Text.Dark},
  -2px 2px 0 ${UI.Text.Dark},
  2px 2px 0 ${UI.Text.Dark}`;

const TextShadow = `-4px 4px 0 ${UI.Text.Dark},
  -1px -1px 0 ${UI.Text.Dark},
  1px -1px 0 ${UI.Text.Dark},
  -1px 1px 0 ${UI.Text.Dark},
  1px 1px 0 ${UI.Text.Dark}`;

const YellowTitle = styled.div({
  color: UI.Text.Yellow,
  fontFamily: BangersFontStack,
  fontSize: Size.XLarge,
  letterSpacing: 5,
  fontWeight: Weight.Normal,
  textShadow: `${TextShadow}`,
  marginBottom: Spacing.Large,
});

const RedTitle = styled.div({
  color: UI.Text.Red,
  fontFamily: BangersFontStack,
  fontSize: Size.Large,
  letterSpacing: 5,
  fontWeight: Weight.Normal,
  textShadow: `${TextShadow}`,
});

const SubTitle = styled.div({
  color: UI.Text.White,
  fontFamily: UIFontStack,
  fontSize: Size.Large,
  lineHeight: 1.55,
  letterSpacing: 2,
  fontWeight: Weight.Bold,
  marginBottom: Spacing.Small,
});

const SectionTitle = styled.div({
  color: UI.Text.Title,
  fontFamily: BangersFontStack,
  fontSize: Size.Large,
  letterSpacing: 3,
  lineHeight: 1.3,
  fontWeight: Weight.Bold,
  marginBottom: Spacing.Tiny,
});

const SectionByline = styled.div({
  color: UI.Text.Byline,
  fontFamily: UIFontStack,
  fontSize: Size.Default,
  lineHeight: 1.55,
  marginBottom: Spacing.Small,
});

const TextDefault = styled.div((props) => ({
  color: UI.Text.Default,
  fontFamily: UIFontStack,
  lineHeight: 1.5,
  fontSize: Size.Default,
  fontWeight: props.bold ? Weight.Bold : '',
}));

const LabelDefault = styled.label({
  color: UI.Text.Default,
  fontFamily: UIFontStack,
  fontSize: Size.Default,
  marginBottom: Spacing.Tiny,
  display: 'block',
});

const Type = {};
Type.Weight = Weight;
Type.Size = Size;
Type.TextShadow = TextShadow;
Type.TextOutline = TextOutline;
Type.TextOutlineBig = TextOutlineBig;

// Large Title
const Title = {};
Type.Title = Title;
Title.Large = YellowTitle;
Title.Byline = SubTitle;
Title.Red = RedTitle;

// Section
const Section = {};
Type.Section = Section;
Section.Title = SectionTitle;
Section.Byline = SectionByline;

// Text
const Text = {};
Type.Text = Text;
Text.Default = TextDefault;

// Label
const Label = {};
Type.Label = Label;
Label.Default = LabelDefault;

const HeadingH1 = styled.h1((props) => ({
  color: UI.Text.Default,
  fontFamily: UIFontStack,
  lineHeight: props.lineHeight || 1.5,
  fontSize: props.fontSize || Size.Large,
  fontWeight: props.fontWeight || Weight.Medium,
}));

const HeadingH2 = styled.h2((props) => ({
  color: UI.Text.Default,
  fontFamily: UIFontStack,
  lineHeight: 1.5,
  fontSize: props.fontSize || Size.Medium,
  fontWeight: props.fontWeight || Weight.Medium,
  margin: '20px 0',
}));

export {
  UIFontStack,
  BangersFontStack,
  Size,
  Weight,
  Title,
  Section,
  Text,
  Label,
  HeadingH1,
  HeadingH2,
};

export default Type;
