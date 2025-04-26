// ** Third Party Components
import {formatDateAndTime} from "@src/resources/constants";

const PublicTrackerTimeline = props => {
    // ** Props
    const { data, isAction } = props

    return (
        <ul className={'timeline ms-50 mb-0'}>
            {data.map((item, i) => {
                if (item.tracker !=='viewed' && item.tracker !=='action'){
                    return (
                        <li key={i} className={'timeline-item'}>
                            <span className={'timeline-point timeline-point-info timeline-point-indicator'} />
                            <div className='timeline-event'>
                                <div
                                    className={'d-flex justify-content-between flex-sm-row flex-column mb-sm-0 mb-1'}
                                >
                                    <h6>{item.full_name} ({item.position_name}): { item.tracker } the file.</h6>
                                    <span className={'me-1'} > {formatDateAndTime(item.created_date, 'date_and_time')} </span>
                                </div>
                            </div>
                        </li>
                    )
                }

                if (isAction){
                    return (
                        <li key={i} className={'timeline-item'}>
                            <span className={'timeline-point timeline-point-info timeline-point-indicator'} />
                            <div className='timeline-event'>
                                <div className={'d-flex justify-content-between flex-sm-row flex-column mb-sm-0 mb-1'} >
                                    <h6>{item.full_name} ({item.position_name}): { item.tracker } the file.</h6>
                                    <span className={'me-1'} > {formatDateAndTime(item.created_date, 'date_and_time')} </span>
                                </div>
                                <div className="text-start mb-1"><p dangerouslySetInnerHTML={{__html: item.action}} /></div>
                            </div>
                        </li>
                    )
                }
            })}
        </ul>
    )
}

export default PublicTrackerTimeline