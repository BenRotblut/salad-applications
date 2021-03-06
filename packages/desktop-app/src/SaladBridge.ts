import { BrowserWindow } from 'electron'

export class SaladBridge {
  private callbacks = new Map<string, Function>()
  constructor(private readonly window: BrowserWindow) {}

  receiveMessage = (_: any, args: { type: string; payload: any }) => {
    let func = this.callbacks.get(args.type)

    if (func) {
      if (args.type !== 'get-idle-time' && args.type !== 'set-idle-time') {
        console.log(`Received message ${args.type}. Payload: ${args.payload}`)
      }
      func(args.payload)
    } else {
      console.log('Received unhandled message type ' + args.type)
    }
  }

  send = (type: string, payload?: any) => {
    this.window.webContents.send('native-dispatch', { type: type, payload: payload })
  }

  on = (type: string, listener: Function) => {
    this.callbacks.set(type, listener)
  }
}
