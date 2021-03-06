import styles from '../styles/Datauser.module.css'
import { useHistory, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react'
import axios from 'axios';
import swal from 'sweetalert'

function Datauser() {
    const id = useParams().id;
    const idcouse = useParams().idcouse;
    const history = useHistory()
    var levelsname = []
    const [level, setlevel] = useState([])
    const [user, setuser] = useState([])
    const [bill, setbill] = useState([])
    
    function checkstatus() {
        const token = localStorage.getItem("token");
        axios({
            method: 'POST',
            url: 'http://wii-pilates.com/check-status',
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({ token })
        }).then(res => {
            if (res.data !== 'admin') {
                history.push("/home");
            }
        })
    }
    
    useEffect(() => {
        axios({
            method: "POST",
            url: `http://wii-pilates.com/datauser/${id}`
        }).then(res => {
            setuser(res.data.datae)
        })
    }, [])

    useEffect(() => {
        axios({
            method: "POST",
            url: `http://wii-pilates.com/databill/${id}/${idcouse}`,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({})
        }).then(res => {
            
            res.data.bill.level.forEach((item, index) => {
                levelsname.push({level : item.level, name : item.name})
                if (!(index == res.data.bill.level - 1)) {
                    setlevel(levelsname)
                }
            });
            setbill(res.data.bill)
        })
        checkstatus()
    }, [])

    function approve() {
        axios({
            method: "POST",
            url: 'http://wii-pilates.com/approve',
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({
                id,
                idcouse,
                levelsname : level
            })
        }).then(res => { 
            
            if (res.data.re) {
                swal({
                    icon: "success",
                    title: "????????????????????????????????????????????????"
                })
                history.push('/userdata')
            }

        })
    }
    
    function deletedata() {
        axios({
            method: "POST",
            url: 'http://wii-pilates.com/deletebill',
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({
                id,
                idcouse
            })
        }).then(res => {
            if (res.data.datae == "seccess") {
                swal({
                    icon: "success",
                    title: "??????????????????????????????????????????"
                })
                history.push('/userdata')
            }
        })
    }

    return (
        <div className={styles.bg}>
            <div className={styles.content}>
                <p>????????????-????????????????????? : <span>{user.name}</span> </p>
                <p>???????????????????????? : <span>{user.tel}</span></p>
            </div>
            <h2 className={styles.title}>????????????????????????????????????????????????</h2>
            <div className={styles.bill}>
                <div className={styles.listbill}>
                    <span>{bill.date}/{bill.time}</span>
                    <h3 className={styles.namedate}>{bill.namecouse}</h3>
                    {bill.level ? bill.level.map((item, index) =>
                        <div key={index} className={styles.level}>
                            <p className={styles.levelone}>??????????????? {item.level} : {item.name} <span> {item.price} ?????????</span> </p>
                        </div>
                    ) : null}
                    <h3 className = {styles.sumpricetitle}>????????????????????? <span>{bill.sumprice} ?????????</span></h3>
                </div>
                <div className={styles.btn}>
                    <button onClick={approve}>??????????????????</button>
                    <button onClick={deletedata}>??????????????????</button>
                </div>
            </div>
        </div>
    )
}
export default Datauser;