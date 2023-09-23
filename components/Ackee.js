import { useRouter } from 'next/router'
import useAckee from 'use-ackee'
import CONFIG from '@/config'

const Ackee = () => {
  const router = useRouter()
  useAckee(
    router.asPath,
    {
      server: CONFIG.ANALYTICS_ACKEE_DATA_SERVER,
      domainId: CONFIG.ANALYTICS_ACKEE_DOMAIN_ID
    },
    {
      detailed: false,
      ignoreLocalhost: true
    }
  )
  return null
}

export default Ackee
