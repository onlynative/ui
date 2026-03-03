import React from 'react'
import useGlobalData from '@docusaurus/useGlobalData'

interface PropInfo {
  name: string
  description: string
  required: boolean
  type: { name: string }
  defaultValue: { value: string } | null
}

interface ComponentData {
  displayName: string
  props: Record<string, PropInfo>
}

interface Props {
  name: string
}

export default function PropTable({ name }: Props) {
  const globalData = useGlobalData()
  const docgenData = globalData?.[
    'docusaurus-plugin-react-docgen-typescript'
  ] as Record<string, { default: ComponentData[] }> | undefined

  if (!docgenData) {
    return <p>No prop data available.</p>
  }

  let component: ComponentData | undefined
  for (const pluginId of Object.keys(docgenData)) {
    const components = docgenData[pluginId]?.default
    if (Array.isArray(components)) {
      component = components.find((c) => c.displayName === name)
      if (component) break
    }
  }

  if (!component) {
    return (
      <p>
        No props found for <code>{name}</code>.
      </p>
    )
  }

  const props = Object.values(component.props)
  if (props.length === 0) {
    return <p>This component has no custom props.</p>
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Prop</th>
          <th>Type</th>
          <th>Default</th>
          <th>Required</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {props.map((prop) => (
          <tr key={prop.name}>
            <td>
              <code>{prop.name}</code>
            </td>
            <td>
              <code>{prop.type.name}</code>
            </td>
            <td>
              {prop.defaultValue ? <code>{prop.defaultValue.value}</code> : '-'}
            </td>
            <td>{prop.required ? 'Yes' : 'No'}</td>
            <td>{prop.description || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
