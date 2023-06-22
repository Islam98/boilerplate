import { Button as ButtonBase } from '@sb/webapp-core/components/buttons';
import { color } from '@sb/webapp-core/theme';
import styled, { css } from 'styled-components';

type ButtonProps = { 'data-unread': boolean };

export const Button = styled(ButtonBase)<ButtonProps>`
  /* svg {
    width: 23px;
    height: 18px;

    ${(props) =>
    props['data-unread'] &&
    css`
      circle {
        fill: ${color.error};
        stroke: ${color.error};
      }
    `};
  } */
`;
