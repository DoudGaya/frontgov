// ** Third Party Components
import {formatDateAndTime} from "@src/resources/constants";

const TrackerTimeline = props => {
    // ** Props
    const { data } = props

    return (
        <ul className={'timeline ms-50 mb-0'}>
            {data.map((item, i) => {
                return (
                    <li key={i} className={'timeline-item'}>
                        <span className={'timeline-point timeline-point-info timeline-point-indicator'} />
                        <div className='timeline-event'>
                            <div
                                className={'d-flex justify-content-between flex-sm-row flex-column mb-sm-0 mb-1'}
                            >
                                <h6>{item.full_name} ({item.position}): { item.tracker === 'read' ? 'Read the request' : item.tracker }</h6>
                                <span className={'me-1'} > {formatDateAndTime(item.created_date, 'date_and_time')} </span>
                            </div>

                        </div>
                    </li>
                )
            })}
        </ul>
    )
}

export default TrackerTimeline
