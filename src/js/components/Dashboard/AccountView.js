import React from "react"
import ContentComponent from "./ContentComponent"

export default props => (
  <ContentComponent header="Account View">
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </ContentComponent>
)
