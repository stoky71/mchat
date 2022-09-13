import styles from './LeftBar.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import AutoComplete from './AutoComplete';
import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { getIndividualChat } from '../../../redux/apiRequest/chatApiRequest';
import { createAxios } from '../../../redux/createInstance';
import { getIndividualChatSuccess } from '../../../redux/chatSlice';
import { searchUser } from '../../../redux/apiRequest/userApiRequest';
import { getSearchSuccess, getUsersSuccess } from '../../../redux/userSlice';

const cx = classNames.bind(styles);

function LeftBar() {
    const currentUser = useSelector((state) => state.auth.login?.currentUser);
    const currentChat = useSelector((state) => state.chat.individualChat?.actor);
    const currentSearch = useSelector((state) => state.user.users?.allUsers);

    const [usersSearch, setUsersSearch] = useState([]);
    const [textSearchUser, setTextSearchUser] = useState('');
    const [chatActors, setChatActors] = useState([]);

    const dispatch = useDispatch();

    const id = currentUser?._id;
    const accessToken = currentUser?.accessToken;

    let axiosJWTChats = createAxios(currentUser, dispatch, getIndividualChatSuccess);
    let axiosJWTSearch = createAxios(currentUser, dispatch, getUsersSuccess);

    useEffect(() => {
        getIndividualChat(accessToken, id, dispatch, axiosJWTChats);
        setChatActors(currentChat);
    }, [chatActors]);

    useEffect(() => {
        const search = textSearchUser === '' ? '@' : textSearchUser;
        searchUser(accessToken, dispatch, search, axiosJWTSearch);
        if (currentSearch !== undefined) {
            setUsersSearch(currentSearch?.filter((user) => user.userName !== currentUser.userName));
        }
    }, [textSearchUser]);

    return (
        <div className={cx('flex-column', 'container-left')}>
            <div className={cx('flex-column', 'avata-search')}>
                <div className={cx('avata')}>
                    <img
                        src={`https://demoaccesss3week2.s3.ap-southeast-1.amazonaws.com/avata01.png`}
                        alt={'avata'}
                    ></img>
                </div>

                <div className={cx('flex-row', 'input-search')}>
                    <button className={cx('btn')}>
                        <img
                            className={cx('btn-img')}
                            src="https://demoaccesss3week2.s3.ap-southeast-1.amazonaws.com/list.png"
                            alt="menu"
                        />
                    </button>
                    <div className={cx('search')}>
                        <AutoComplete
                            users={usersSearch}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search input"
                                    InputProps={{
                                        ...params.InputProps,
                                        type: 'search',
                                        onChange: (e) => {
                                            setTextSearchUser(e.target.value);
                                        },
                                    }}
                                />
                            )}
                        />
                    </div>
                </div>
            </div>
            {chatActors?.map((actor, index) => {
                return (
                    <div key={index} className={cx('flex-column', 'scroller-column', 'list-item')}>
                        <div className={cx('flex-row', 'item')}>
                            <img
                                src={`https://demoaccesss3week2.s3.ap-southeast-1.amazonaws.com/avata01.png`}
                                alt={'avata'}
                            />
                            <div className={cx('flex-column', 'content-item')}>
                                <p>{actor?.sender.profileName}</p>
                                <span>{actor?.sender.status}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default LeftBar;
