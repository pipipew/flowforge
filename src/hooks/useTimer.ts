import { useEffect, useRef } from 'react'
import { useTimerStore } from '@/store/useTimerStore'

export function useTimer() {
  const { status, tick } = useTimerStore()
  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    // Initialize worker
    workerRef.current = new Worker(new URL('/timer-worker.js', import.meta.url))
    
    workerRef.current.onmessage = (e) => {
      if (e.data === 'tick') {
        tick()
      }
    }

    return () => {
      workerRef.current?.terminate()
    }
  }, [tick])

  useEffect(() => {
    if (status === 'running') {
      workerRef.current?.postMessage('start')
    } else {
      workerRef.current?.postMessage('pause')
    }
  }, [status])

  return null
}
