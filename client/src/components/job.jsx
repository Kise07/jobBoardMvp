
export default function Job({ job }) {
  return (
    <>
      <div className={'job'}>
        <span>{job.role}</span>
        <span>{job.company}</span>
      </div>
    </>
  )
}
