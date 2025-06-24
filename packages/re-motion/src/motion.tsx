import * as React from 'react';

import { isTransformKey, transformKeys } from './styleTransformUtils';
import { applyAttrs, applyStyles, applyTransforms } from './apply';
import { MotionValue } from './MotionValue';

type MotionStyle = {
  [K in keyof React.CSSProperties]?:
    | React.CSSProperties[K]
    | MotionValue<number | string>;
} & {
  [key in (typeof transformKeys)[number]]?:
    | MotionValue<number | string>
    | number
    | string;
};

type MotionHTMLAttributes<T> = {
  [K in keyof React.HTMLAttributes<T>]?:
    | React.HTMLAttributes<T>[K]
    | MotionValue<number | string>;
};

type MotionSVGAttributes<T> = {
  [K in keyof React.SVGAttributes<T>]?:
    | React.SVGAttributes<T>[K]
    | MotionValue<number | string>;
};

type MotionAttributes<T extends EventTarget> = Omit<
  MotionHTMLAttributes<T> & MotionSVGAttributes<T>,
  'style'
> & {
  style?: MotionStyle;
};

function combineRefs<T>(
  ...refs: Array<
    React.RefObject<T> | ((el: T | null) => void) | null | undefined
  >
) {
  return (element: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') ref(element);
      else if ('current' in ref) (ref.current as T | null) = element;
    }
  };
}

export function makeMotion<Tag extends keyof JSX.IntrinsicElements>(
  Wrapped: Tag
) {
  const MotionComp = React.forwardRef<
    HTMLElement,
    MotionAttributes<HTMLElement>
  >((givenProps, givenRef) => {
    const nodeRef = React.useRef<HTMLElement | null>(null);

    React.useLayoutEffect(() => {
      const node = nodeRef.current;
      if (!node) return;

      const { style = {}, ...rest } = givenProps;

      const normal: Record<string, any> = {};
      const tx: Record<string, any> = {};

      for (const [k, v] of Object.entries(style)) {
        if (isTransformKey(k)) tx[k] = v;
        else normal[k] = v;
      }

      const cleanSubs = [
        ...applyStyles(node, normal),
        ...applyTransforms(node, style),
        ...applyAttrs(node, rest),
      ];

      return () => cleanSubs.forEach((c) => c());
    }, []);

    return React.createElement(Wrapped, {
      ...givenProps,
      ref: combineRefs(nodeRef, givenRef),
    });
  });

  MotionComp.displayName =
    typeof Wrapped === 'string'
      ? `Motion.${Wrapped}`
      : `Motion(${
          (Wrapped as any).displayName || (Wrapped as any).name || 'Component'
        })`;

  return MotionComp;
}

const tags = [
  'a',
  'abbr',
  'address',
  'area',
  'article',
  'aside',
  'audio',
  'b',
  'base',
  'bdi',
  'bdo',
  'big',
  'blockquote',
  'body',
  'br',
  'button',
  'canvas',
  'caption',
  'center',
  'cite',
  'code',
  'col',
  'colgroup',
  'data',
  'datalist',
  'dd',
  'del',
  'details',
  'dfn',
  'dialog',
  'div',
  'dl',
  'dt',
  'em',
  'embed',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hgroup',
  'hr',
  'html',
  'i',
  'iframe',
  'img',
  'input',
  'ins',
  'kbd',
  'keygen',
  'label',
  'legend',
  'li',
  'link',
  'main',
  'map',
  'mark',
  'menu',
  'menuitem',
  'meta',
  'meter',
  'nav',
  'noindex',
  'noscript',
  'object',
  'ol',
  'optgroup',
  'option',
  'output',
  'p',
  'param',
  'picture',
  'pre',
  'progress',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'search',
  'section',
  'select',
  'small',
  'source',
  'span',
  'strong',
  'style',
  'sub',
  'summary',
  'sup',
  'table',
  'template',
  'tbody',
  'td',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'title',
  'tr',
  'track',
  'u',
  'ul',
  'var',
  'video',
  'wbr',

  // SVG Tags
  'svg',
  'animate',
  'animateMotion',
  'animateTransform',
  'circle',
  'clipPath',
  'defs',
  'desc',
  'ellipse',
  'feBlend',
  'feColorMatrix',
  'feComponentTransfer',
  'feComposite',
  'feConvolveMatrix',
  'feDiffuseLighting',
  'feDisplacementMap',
  'feDistantLight',
  'feDropShadow',
  'feFlood',
  'feFuncA',
  'feFuncB',
  'feFuncG',
  'feFuncR',
  'feGaussianBlur',
  'feImage',
  'feMerge',
  'feMergeNode',
  'feMorphology',
  'feOffset',
  'fePointLight',
  'feSpecularLighting',
  'feSpotLight',
  'feTile',
  'feTurbulence',
  'filter',
  'foreignObject',
  'g',
  'image',
  'line',
  'linearGradient',
  'marker',
  'mask',
  'metadata',
  'mpath',
  'path',
  'pattern',
  'polygon',
  'polyline',
  'radialGradient',
  'rect',
  'set',
  'stop',
  'switch',
  'symbol',
  'text',
  'textPath',
  'tspan',
  'use',
  'view',
] as const;

type MotionMap = {
  [Tag in (typeof tags)[number]]: ReturnType<typeof makeMotion<Tag>>;
};

export const motion = tags.reduce((acc, tag) => {
  acc[tag] = makeMotion(tag);
  return acc;
}, {} as MotionMap);
