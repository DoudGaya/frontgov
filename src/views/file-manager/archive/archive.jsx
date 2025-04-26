import {connect} from "react-redux"
import { MoreVertical, Rewind, Trash
} from "react-feather";
import {Fragment, useEffect, useState} from "react";
import {formatDateAndTime, serverLink} from "@src/resources/constants";
import axios from "axios";
import {toast} from "react-toastify";
import Breadcrumbs from "../../../@core/components/breadcrumbs";
import SpinnerLoader from "../../../component/common/spinner-loader/spinner-loader";
import {
    Card,
    CardBody,
    CardHeader,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Row,
    UncontrolledDropdown
} from "reactstrap";
import Table from "../../../component/common/table/table";
import {useNavigate} from "react-router-dom";
import {showConfirm} from "@src/component/common/sweetalert/sweetalert";

function Archive(props) {
    const token = props.loginData[0]?.token;
    const user_id = props.loginData[0]?.user_id;
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [datatable, setDatatable] = useState({
        columns: [
            {
                label: "S/N",
                field: "sn",
            },
            {
                label: "Name",
                field: "item_name",
            },
            {
                label: "Size",
                field: "item_size",
            },
            {
                label: "Deleted Date",
                field: "inserted_date",
            },
            {
                label: "Action",
                field: "action",
            }
        ],
        rows: [],
    });
    const initialFormValues = {
        user_id: props.loginData[0]?.user_id,
        employee_id:  props.loginData[0]?.employee_id,
        archive_id: "",
        item_id: "",
        item_name: "",
        item_size: "",
        item_path: ``,
        archive_type: "",
        tracking_code: "",
        position: props.loginData[0]?.position_name,
        full_name: props.loginData[0]?.full_name,
        agency_id: props.loginData[0]?.agency_id,
        created_by: props.loginData[0]?.agency_id,
    }
    const [formData, setFormData] = useState(initialFormValues)
    const resetForm = () => {
        setFormData(initialFormValues)
    }

    const getData = async () => {
        await axios.get(`${serverLink}file-manager/archive/list/${user_id}`, token)
            .then((result) => {
                if (result.data.message === "success") {
                    generateTable(result.data.data)
                }
                setIsLoading(false);
            })
            .catch(() => {
                console.log("NETWORK ERROR");
            });

    };

    const getItemIcon = (type) => {
      if (type === 'folder'){
          return <span className="avatar-content"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
																<path opacity="0.3" d="M10 4H21C21.6 4 22 4.4 22 5V7H10V4Z" fill="currentColor"></path>
																<path d="M9.2 3H3C2.4 3 2 3.4 2 4V19C2 19.6 2.4 20 3 20H21C21.6 20 22 19.6 22 19V7C22 6.4 21.6 6 21 6H12L10.4 3.60001C10.2 3.20001 9.7 3 9.2 3Z" fill="currentColor"></path>
															</svg></span>;
      }else{
          switch (type) {
              case 'pdf':
                  return <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18.53 9L13 3.47C12.8595 3.32931 12.6688 3.25018 12.47 3.25H8C7.27065 3.25 6.57118 3.53973 6.05546 4.05546C5.53973 4.57118 5.25 5.27065 5.25 6V18C5.25 18.7293 5.53973 19.4288 6.05546 19.9445C6.57118 20.4603 7.27065 20.75 8 20.75H16C16.7293 20.75 17.4288 20.4603 17.9445 19.9445C18.4603 19.4288 18.75 18.7293 18.75 18V9.5C18.7421 9.3116 18.6636 9.13309 18.53 9ZM13.25 5.81L16.19 8.75H13.25V5.81ZM16 19.25H8C7.66848 19.25 7.35054 19.1183 7.11612 18.8839C6.8817 18.6495 6.75 18.3315 6.75 18V6C6.75 5.66848 6.8817 5.35054 7.11612 5.11612C7.35054 4.8817 7.66848 4.75 8 4.75H11.75V9.5C11.7526 9.69811 11.8324 9.88737 11.9725 10.0275C12.1126 10.1676 12.3019 10.2474 12.5 10.25H17.25V18C17.25 18.3315 17.1183 18.6495 16.8839 18.8839C16.6495 19.1183 16.3315 19.25 16 19.25Z" fill="#000000"></path> <path d="M13.49 14.85C12.8751 14.4642 12.4124 13.8778 12.18 13.19C12.3953 12.5467 12.4603 11.8625 12.37 11.19C12.3412 11.0206 12.2586 10.865 12.1344 10.7462C12.0102 10.6274 11.8511 10.5518 11.6806 10.5305C11.5101 10.5092 11.3372 10.5433 11.1876 10.6279C11.038 10.7125 10.9197 10.843 10.85 11C10.7362 11.8085 10.822 12.6325 11.1 13.4C10.7202 14.2873 10.2963 15.1551 9.83001 16C9.12001 16.4 8.15001 17 8.00001 17.69C7.88001 18.25 8.93001 19.69 10.72 16.57C11.5159 16.2746 12.3312 16.034 13.16 15.85C13.7727 16.2003 14.4561 16.4088 15.16 16.46C15.3216 16.4642 15.4809 16.4206 15.6178 16.3345C15.7546 16.2484 15.863 16.1238 15.9292 15.9764C15.9955 15.8289 16.0167 15.6651 15.9901 15.5056C15.9636 15.3462 15.8905 15.1981 15.78 15.08C15.36 14.65 14.11 14.77 13.49 14.85ZM8.71001 17.85C8.99025 17.3705 9.36034 16.9495 9.80001 16.61C9.12001 17.69 8.71001 17.88 8.71001 17.86V17.85ZM11.63 11.04C11.89 11.04 11.87 12.19 11.69 12.5C11.5544 12.0285 11.5338 11.5312 11.63 11.05V11.04ZM10.76 15.92C11.0988 15.3019 11.3929 14.6602 11.64 14C11.9049 14.493 12.2734 14.9229 12.72 15.26C12.0491 15.4281 11.3934 15.6522 10.76 15.93V15.92ZM15.46 15.74C15.46 15.74 15.28 15.96 14.13 15.46C15.38 15.38 15.59 15.67 15.46 15.75V15.74Z" fill="#000000"></path> </g></svg>;
              case 'png':
                  return <svg viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg"  fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>File-Png</title> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="File-Png"> <rect id="Rectangle" fillRule="nonzero" x="0" y="0" width="24" height="24"> </rect> <path d="M4,5 C4,3.89543 4.89543,3 6,3 L15.1716,3 C15.702,3 16.2107,3.21071 16.5858,3.58579 L19.4142,6.41421 C19.7893,6.78929 20,7.29799 20,7.82843 L20,19 C20,20.1046 19.1046,21 18,21 L6,21 C4.89543,21 4,20.1046 4,19 L4,5 Z" id="Path" stroke="#0C0310" strokeWidth="2" strokeLinecap="round"> </path> <path d="M15,4 L15,6 C15,7.10457 15.8954,8 17,8 L19,8" id="Path" stroke="#0C0310" strokeWidth="2" strokeLinecap="round"> </path> <path d="M9.56527,14.06 C9.56527,14.308 9.51927,14.518 9.42727,14.69 C9.33527,14.858 9.21127,14.994 9.05527,15.098 C8.89927,15.202 8.71927,15.278 8.51527,15.326 C8.31127,15.374 8.09927,15.398 7.87927,15.398 L7.36927,15.398 L7.36927,17 L6.34327,17 L6.34327,12.752 L7.90327,12.752 C8.13527,12.752 8.35127,12.776 8.55127,12.824 C8.75527,12.868 8.93127,12.942 9.07927,13.046 C9.23127,13.146 9.34927,13.28 9.43327,13.448 C9.52127,13.612 9.56527,13.816 9.56527,14.06 Z M8.53927,14.066 C8.53927,13.966 8.51927,13.884 8.47927,13.82 C8.43927,13.756 8.38527,13.706 8.31727,13.67 C8.24927,13.634 8.17127,13.61 8.08327,13.598 C7.99927,13.586 7.91127,13.58 7.81927,13.58 L7.36927,13.58 L7.36927,14.582 L7.80127,14.582 C7.89727,14.582 7.98927,14.574 8.07727,14.558 C8.16527,14.542 8.24327,14.514 8.31127,14.474 C8.38327,14.434 8.43927,14.382 8.47927,14.318 C8.51927,14.25 8.53927,14.166 8.53927,14.066 Z M12.8812,17 L11.1712,14.222 L11.1532,14.222 L11.1772,17 L10.1812,17 L10.1812,12.752 L11.3512,12.752 L13.0552,15.524 L13.0732,15.524 L13.0492,12.752 L14.0452,12.752 L14.0452,17 L12.8812,17 Z M18.6954,16.742 C18.4874,16.85 18.2434,16.938 17.9634,17.006 C17.6874,17.074 17.3854,17.108 17.0574,17.108 C16.7174,17.108 16.4034,17.054 16.1154,16.946 C15.8314,16.838 15.5854,16.686 15.3774,16.49 C15.1734,16.294 15.0134,16.06 14.8974,15.788 C14.7814,15.512 14.7234,15.206 14.7234,14.87 C14.7234,14.53 14.7814,14.222 14.8974,13.946 C15.0174,13.67 15.1814,13.436 15.3894,13.244 C15.5974,13.048 15.8414,12.898 16.1214,12.794 C16.4014,12.69 16.7034,12.638 17.0274,12.638 C17.3634,12.638 17.6754,12.69 17.9634,12.794 C18.2514,12.894 18.4854,13.03 18.6654,13.202 L18.0174,13.94 C17.9174,13.824 17.7854,13.73 17.6214,13.658 C17.4574,13.582 17.2714,13.544 17.0634,13.544 C16.8834,13.544 16.7174,13.578 16.5654,13.646 C16.4134,13.71 16.2814,13.802 16.1694,13.922 C16.0574,14.038 15.9694,14.178 15.9054,14.342 C15.8454,14.502 15.8154,14.678 15.8154,14.87 C15.8154,15.066 15.8434,15.246 15.8994,15.41 C15.9554,15.574 16.0374,15.716 16.1454,15.836 C16.2574,15.952 16.3934,16.044 16.5534,16.112 C16.7174,16.176 16.9034,16.208 17.1114,16.208 C17.2314,16.208 17.3454,16.2 17.4534,16.184 C17.5614,16.164 17.6614,16.134 17.7534,16.094 L17.7534,15.32 L16.9434,15.32 L16.9434,14.492 L18.6954,14.492 L18.6954,16.742 Z" id="Shape" fill="#0C0310" fillRule="nonzero"> </path> </g> </g> </g></svg>;
              case 'doc':
                  return <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 548.291 548.291"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M486.201,196.121h-13.166v-63.525c0-0.399-0.062-0.795-0.115-1.2c-0.021-2.522-0.825-5-2.552-6.96L364.657,3.675 c-0.033-0.031-0.064-0.042-0.085-0.073c-0.63-0.704-1.364-1.292-2.143-1.796c-0.229-0.157-0.461-0.286-0.702-0.419 c-0.672-0.365-1.387-0.672-2.121-0.893c-0.2-0.052-0.379-0.134-0.577-0.188C358.23,0.118,357.401,0,356.562,0H96.757 C84.894,0,75.256,9.649,75.256,21.502v174.613H62.092c-16.971,0-30.732,13.756-30.732,30.73v159.81 c0,16.966,13.761,30.736,30.732,30.736h13.164V526.79c0,11.854,9.638,21.501,21.501,21.501h354.776 c11.853,0,21.501-9.647,21.501-21.501V417.392h13.166c16.966,0,30.729-13.764,30.729-30.731v-159.81 C516.93,209.877,503.167,196.121,486.201,196.121z M96.757,21.507h249.054v110.006c0,5.94,4.817,10.751,10.751,10.751h94.972 v53.861H96.757V21.507z M367.547,335.847c7.843,0,16.547-1.701,21.666-3.759l3.916,20.301c-4.768,2.376-15.509,4.949-29.493,4.949 c-39.748,0-60.204-24.73-60.204-57.472c0-39.226,27.969-61.055,62.762-61.055c13.465,0,23.705,2.737,28.31,5.119l-5.285,20.64 c-5.287-2.226-12.615-4.263-21.832-4.263c-20.641,0-36.663,12.444-36.663,38.027C330.718,321.337,344.362,335.847,367.547,335.847z M291.647,296.97c0,37.685-22.854,60.537-56.444,60.537c-34.113,0-54.066-25.759-54.066-58.495 c0-34.447,21.995-60.206,55.94-60.206C272.39,238.806,291.647,265.248,291.647,296.97z M67.72,355.124V242.221 c9.552-1.532,21.999-2.375,35.13-2.375c21.83,0,35.981,3.916,47.055,12.276c11.945,8.863,19.455,23.021,19.455,43.311 c0,21.994-8.017,37.181-19.105,46.556c-12.111,10.058-30.528,14.841-53.045,14.841C83.749,356.825,74.198,355.968,67.72,355.124z M451.534,520.968H96.757V417.392h354.776V520.968z M471.245,355.627l-10.409-20.804c-4.263-8.012-6.992-13.99-10.231-20.636 h-0.342c-2.388,6.656-5.28,12.624-8.861,20.636l-9.552,20.804h-29.675l33.254-58.158l-32.054-56.786h29.849l10.058,20.984 c3.413,6.979,5.963,12.614,8.694,19.092h0.335c2.729-7.332,4.955-12.446,7.843-19.092l9.721-20.984h29.683l-32.406,56.103 l34.105,58.841H471.245z"></path> <path d="M141.729,296.277c0.165-23.869-13.814-36.494-36.15-36.494c-5.807,0-9.552,0.514-11.772,1.027v75.2 c2.226,0.509,5.806,0.509,9.047,0.509C126.388,336.698,141.729,323.743,141.729,296.277z"></path> <path d="M208.604,298.493c0,22.515,10.575,38.372,27.969,38.372c17.567,0,27.617-16.703,27.617-39.045 c0-20.641-9.885-38.377-27.801-38.377C218.827,259.448,208.604,276.162,208.604,298.493z"></path> </g> </g></svg>;
              case 'jpg':
                  return <svg fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" ><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M459.216,184.742V77.791l-3.521-2.351L348.234,0H52.783v184.742H26.392v205.856h26.392V512h406.433V390.598h26.392 V184.742H459.216z M353.649,23.151l72.278,50.746h-72.278V23.151z M68.618,15.835h269.196v73.897h105.567v95.01H68.618V15.835z M443.381,496.165H68.618V390.598h374.763V496.165z M469.773,374.763H42.227V200.577h427.546V374.763z"></path> </g> </g> <g> <g> <rect x="113.485" y="432.825" width="285.031" height="15.835"></rect> </g> </g> <g> <g> <rect x="435.464" y="216.412" width="21.113" height="15.835"></rect> </g> </g> <g> <g> <rect x="435.464" y="343.093" width="21.113" height="15.835"></rect> </g> </g> <g> <g> <rect x="55.423" y="343.093" width="21.113" height="15.835"></rect> </g> </g> <g> <g> <rect x="55.423" y="216.412" width="21.113" height="15.835"></rect> </g> </g> <g> <g> <path d="M361.567,295.588h34.309v7.918c0,0.071-0.115,7.336-4.235,14.546c-5.492,9.612-15.61,14.485-30.074,14.485 c-28.006,0-34.309-9.772-34.309-13.196v-57.962c0.095-2.097,1.888-18.575,34.309-18.575c32.651,0,34.237,16.711,34.31,18.617 l-0.001-0.143h15.835c0-0.96-0.197-9.621-7.014-18.143c-8.582-10.728-23.094-16.167-43.13-16.167s-34.549,5.439-43.13,16.167 c-6.816,8.521-7.014,17.183-7.014,18.143v58.062c0,2.971,1.407,29.031,50.144,29.031c49.571,0,50.144-44.417,50.144-44.866 v-23.753h-50.144V295.588z"></path> </g> </g> <g> <g> <path d="M282.392,226.969h-63.34c-8.571,0-13.196,6.799-13.196,13.196V351.01h15.835v-55.423h60.701 c8.571,0,13.196-6.799,13.196-13.196v-42.227C295.588,231.594,288.789,226.969,282.392,226.969z M279.753,279.753h-58.062v-36.948 h58.062V279.753z"></path> </g> </g> <g> <g> <path d="M174.186,224.33v79.175c0,16.007-13.023,29.031-29.031,29.031s-29.031-13.024-29.031-29.031h-15.835 c0,24.74,20.126,44.866,44.866,44.866s44.866-20.126,44.866-44.866V224.33H174.186z"></path> </g> </g> <g> <g> <path d="M204.646,68.619l-5.278-31.67h-76.755l-5.278,31.67H89.732v95.01h142.516v-95.01H204.646z M216.412,147.794H105.567 v-63.34h25.182l5.278-31.67h49.926l5.278,31.67h25.181V147.794z"></path> </g> </g> <g> <g> <rect x="134.598" y="105.567" width="52.784" height="15.835"></rect> </g> </g> </g></svg>;
              case 'jpeg':
                  return <svg fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" ><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M459.216,184.742V77.791l-3.521-2.351L348.234,0H52.783v184.742H26.392v205.856h26.392V512h406.433V390.598h26.392 V184.742H459.216z M353.649,23.151l72.278,50.746h-72.278V23.151z M68.618,15.835h269.196v73.897h105.567v95.01H68.618V15.835z M443.381,496.165H68.618V390.598h374.763V496.165z M469.773,374.763H42.227V200.577h427.546V374.763z"></path> </g> </g> <g> <g> <rect x="113.485" y="432.825" width="285.031" height="15.835"></rect> </g> </g> <g> <g> <rect x="435.464" y="216.412" width="21.113" height="15.835"></rect> </g> </g> <g> <g> <rect x="435.464" y="343.093" width="21.113" height="15.835"></rect> </g> </g> <g> <g> <rect x="55.423" y="343.093" width="21.113" height="15.835"></rect> </g> </g> <g> <g> <rect x="55.423" y="216.412" width="21.113" height="15.835"></rect> </g> </g> <g> <g> <path d="M361.567,295.588h34.309v7.918c0,0.071-0.115,7.336-4.235,14.546c-5.492,9.612-15.61,14.485-30.074,14.485 c-28.006,0-34.309-9.772-34.309-13.196v-57.962c0.095-2.097,1.888-18.575,34.309-18.575c32.651,0,34.237,16.711,34.31,18.617 l-0.001-0.143h15.835c0-0.96-0.197-9.621-7.014-18.143c-8.582-10.728-23.094-16.167-43.13-16.167s-34.549,5.439-43.13,16.167 c-6.816,8.521-7.014,17.183-7.014,18.143v58.062c0,2.971,1.407,29.031,50.144,29.031c49.571,0,50.144-44.417,50.144-44.866 v-23.753h-50.144V295.588z"></path> </g> </g> <g> <g> <path d="M282.392,226.969h-63.34c-8.571,0-13.196,6.799-13.196,13.196V351.01h15.835v-55.423h60.701 c8.571,0,13.196-6.799,13.196-13.196v-42.227C295.588,231.594,288.789,226.969,282.392,226.969z M279.753,279.753h-58.062v-36.948 h58.062V279.753z"></path> </g> </g> <g> <g> <path d="M174.186,224.33v79.175c0,16.007-13.023,29.031-29.031,29.031s-29.031-13.024-29.031-29.031h-15.835 c0,24.74,20.126,44.866,44.866,44.866s44.866-20.126,44.866-44.866V224.33H174.186z"></path> </g> </g> <g> <g> <path d="M204.646,68.619l-5.278-31.67h-76.755l-5.278,31.67H89.732v95.01h142.516v-95.01H204.646z M216.412,147.794H105.567 v-63.34h25.182l5.278-31.67h49.926l5.278,31.67h25.181V147.794z"></path> </g> </g> <g> <g> <rect x="134.598" y="105.567" width="52.784" height="15.835"></rect> </g> </g> </g></svg>;
              case 'csv':
                  return <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M15.29 1H3v11h1V2h10v6h6v14H4v-3H3v4h18V6.709zM20 7h-5V2h.2L20 6.8zm-4.96 11l2.126-5H16.08l-1.568 3.688L12.966 13h-1.084l2.095 5zM7 14.349v.302A1.35 1.35 0 0 0 8.349 16H9.65a.349.349 0 0 1 .349.349v.302A.349.349 0 0 1 9.65 17H7v1h2.651A1.35 1.35 0 0 0 11 16.651v-.302A1.35 1.35 0 0 0 9.651 15H8.35a.349.349 0 0 1-.35-.349v-.302A.349.349 0 0 1 8.349 14H11v-1H8.349A1.35 1.35 0 0 0 7 14.349zm-5 .692v.918A2.044 2.044 0 0 0 4.041 18H6v-1H4.041A1.042 1.042 0 0 1 3 15.959v-.918A1.042 1.042 0 0 1 4.041 14H6v-1H4.041A2.044 2.044 0 0 0 2 15.041z"></path><path fill="none" d="M0 0h24v24H0z"></path></g></svg>;
              default:
                  return <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M13 3H8.2C7.0799 3 6.51984 3 6.09202 3.21799C5.71569 3.40973 5.40973 3.71569 5.21799 4.09202C5 4.51984 5 5.0799 5 6.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.0799 21 8.2 21H15.8C16.9201 21 17.4802 21 17.908 20.782C18.2843 20.5903 18.5903 20.2843 18.782 19.908C19 19.4802 19 18.9201 19 17.8V9M13 3L19 9M13 3V7.4C13 7.96005 13 8.24008 13.109 8.45399C13.2049 8.64215 13.3578 8.79513 13.546 8.89101C13.7599 9 14.0399 9 14.6 9H19M10 11.5H14V17.5L12 16.3094L10 17.5V11.5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>;
          }
      }
    }

    const generateTable = (table_data) => {
        let rowData = [];
        table_data.map((item, index)=> {
            rowData.push({
                sn: index + 1,
                item_name:  <div className="d-flex align-items-center"><div className="avatar rounded bg-light-info" style={{marginRight: '15px'}}><span className="avatar-content">
                     {getItemIcon(item.archive_type)}
                </span></div> <div>{item.item_name}</div></div>,
                item_size: item.item_size + "MB",
                inserted_date: formatDateAndTime(item.created_date, 'date_and_time'),
                action:  (
                    <div className="d-flex">
                        <UncontrolledDropdown>
                            <DropdownToggle className='icon-btn hide-arrow' color='transparent' size='sm' caret>
                                <MoreVertical size={15} />
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem className='w-100'  onClick={() => {
                                    showConfirm("Warning", `Are you sure you want to restore this item/folder?`, "warning")
                                        .then( async (confirm) => {
                                            if (confirm) {
                                                onRestore(item)                                        }
                                        })
                                }}>
                                    <Rewind className='me-50' size={15} /> <span className='align-middle'>Restore</span>
                                </DropdownItem>
                                <DropdownItem className='w-100'  onClick={() => {
                                    showConfirm("Warning", `Are you sure you want to permanently delete this item/folder?`, "warning")
                                        .then( async (confirm) => {
                                            if (confirm) {
                                                onDelete(item)                                        }
                                        })
                                }}>
                                    <Trash className='me-50' size={15} /> <span className='align-middle'>Delete</span>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </div>
                ),
            });
        })
        setDatatable({
            ...datatable,
            columns: datatable.columns,
            rows: rowData,
        });
    }

    const onDelete = async (item) => {
        const sendData = {
            ...formData,
            item_id: item.item_id,
            item_name: item.item_name,
            item_path: item.item_path,
            item_size: item.item_size,
            tracking_code: item.tracking_code,
            archive_type: item.archive_type,
        }
        await axios.post(`${serverLink}file-manager/archive/delete`, sendData, token)
            .then(data => {
                const result = data.data;
                if (result.message === "success") {
                    item.archive_type === 'folder' ? toast.success("Folder Permanently Deleted Successfully") : toast.success("File Deleted Successfully")
                    getData()
                    resetForm()
                } else {
                    toast.error("Something went wrong. Please try again!");
                }
            });
    }

    const onRestore = async (item) => {
        const sendData = {
            ...formData,
            archive_id: item.archive_id,
            item_id: item.item_id,
            item_name: item.item_name,
            archive_type: item.archive_type,
        }
        await axios.post(`${serverLink}file-manager/archive/restore`, sendData, token)
            .then(data => {
                const result = data.data;
                if (result.message === "success") {
                    item.archive_type === 'folder' ? toast.success("Folder Restore Successfully") : toast.success("File Restore Successfully")
                    getData()
                    resetForm()
                } else {
                    toast.error("Something went wrong. Please try again!");
                }
            });
    }

    const DocumentData = () => {
        return (
            <Card>
                <CardHeader>
                    <div className="card-toolbar col-md-12 col-12 p-0">
                        <div className='d-flex justify-content-between align-items-center'>
                            <div className="col-md-4">
                                <h4><Trash/> Archive</h4>
                            </div>

                        </div>
                        <hr style={{marginTop: '8px', marginBottom: '0px'}}/>
                    </div>
                </CardHeader>
                <CardBody>
                    <Row className='gy-2'>
                        <Table data={datatable}/>
                    </Row>
                </CardBody>
            </Card>
        )
    }


    useEffect(() => {
        if (props.loginData[0].permission.filter(e=>e.permission === 'file_archived').length < 1) {
            navigate('/')
        }
        getData();
    }, []);
    return (
        <Fragment>
            {
                isLoading ? <SpinnerLoader/>
                    :
                    <>
                        <div className="row">
                            <div className="col-md-9 col-8">
                                <Breadcrumbs title=' Archive'
                                             data={[{title: 'File Manager'}, {title: 'Archive'}]}/>
                            </div>

                        </div>
                        <div className='blog-wrapper'>
                            <DocumentData/>
                        </div>
                    </>
            }
        </Fragment>
    )
}

const mapStateToProps = (state) => {
    return {
        loginData: state.LoginDetails,
    }
}


export default connect(mapStateToProps, null)(Archive)