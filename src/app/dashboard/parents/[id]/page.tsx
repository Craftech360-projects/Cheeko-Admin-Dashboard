import { ParentDetailsClient } from './client'

interface ParentDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ParentDetailsPage({ params }: ParentDetailsPageProps) {
  const { id } = await params
  return <ParentDetailsClient id={id} />
}