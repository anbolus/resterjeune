import { useState, useRef } from "react";
import classNames from "classnames";
import { formatDistance } from "date-fns";
import Image from "next/image";
import * as linkify from "linkifyjs";
import linkifyHtml from "linkify-html";
import { getVideoInfo } from './utils/youtube'

export default function VideoPlay({ id, title, description }) {
    const [prenom, setPrenom] = useState('')
    const [nom, setNom] = useState('')
    const [email, setEmail] = useState('')

    const handleSubmit = async e => {
        e.preventDefault()
        if (prenom && nom && email) {
            console.log(`prenom: ${prenom}`)
            console.log(`nom: ${nom}`)
            console.log(`email: ${email}`)
        }
    }

    return (
        <div>
            <>
                <div className="w-9/12 place-content-center h-3/6">
                    <iframe
                        src={`https://www.youtube.com/embed/${id}?autoplay=1`}
                        //frameBorder="0"
                        /* height="500px"
                        width="100%" */
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
                <h2 className="text-3xl font-medium my-6">
                    {title}
                </h2>
                <p
                    className="prose"
                    dangerouslySetInnerHTML={{
                        __html: linkifyHtml(
                            description?.replace(
                                /\n/g,
                                " <br />"
                            ),
                            {
                                target: { url: "_blank" },
                            }
                        ),
                    }}
                ></p><br />
                <form onSubmit={handleSubmit}>
                    <label>Prénom</label>
                    <input
                        type='text'
                        name='Prenom'
                        onChange={e => {
                            setPrenom(e.target.value)
                        }}
                    /><br />
                    <label>Nom</label>
                    <input
                        type='text'
                        name='Nom'
                        onChange={e => {
                            setNom(e.target.value)
                        }}
                    /><br />
                    <label>Email</label>
                    <input
                        type='text'
                        name='Email'
                        onChange={e => {
                            setEmail(e.target.value)
                        }}
                    /><br />
                    <button type='submit'>Envoyer</button>
                </form>
                {/* <iframe src="https://www.instagram.com/resterjeune.com_officiel/embed" width="640" height="400" frameborder="0" allowtransparency="true"></iframe> */}
            </>
        </div>
    )
}

export async function getServerSideProps({ query }) {
    const { id } = query;
    const info = await getVideoInfo(id);
    console.log(info)
    const title = info.items[0].snippet.title;
    const description = info.items[0].snippet.description;

    return {
        props: {
            id,
            title,
            description,
        },
    }
}