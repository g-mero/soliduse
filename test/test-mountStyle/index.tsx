import { mountStyle } from '@/mountStyle'

export default function TestMountStyle() {
  mountStyle(`
    body {
      background-color: red;
    }
  `, 'test-mountStyle')
  return (
    <div>
      <h1>Test Mount Style</h1>
    </div>
  )
}
