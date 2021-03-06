import React from "react"
import { Icon, Menu } from "semantic-ui-react"
import Styled from "styled-components"

import HeartBeat from "./../../Animations/HeartBeat"
import MobileOnly from "./../../Responsive/MobileOnly"
import NonMobileContent from "./../../Responsive/NonMobileContent"

const IconBeat = Styled.a`
  &:hover .icon {
    animation: ${HeartBeat} 2.4s infinite linear;
  }
`

export default ({ login }) => (
    <Menu.Item header position="right" onClick={login}>
        <Icon name="google" />
        <Icon name="facebook" />
        <MobileOnly>
            <Icon name="user circle outline" />
        </MobileOnly>
        <NonMobileContent>Login</NonMobileContent>
    </Menu.Item>
)
