import {
  CancelOutlined,
  AddCircleOutline,
  Delete,
  BookmarkBorderOutlined,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  OutlinedInput,
  useTheme,
  IconButton,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useMemo } from "react";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import {
  faYoutube,
  faTelegram,
  faReddit,
  faTwitch,
  faTiktok,
  faSoundcloud,
  faDiscord,
} from "@fortawesome/free-brands-svg-icons";
import SkeletonLoad from "components/SkeletonLoad";
import FlexBetween from "components/FlexBetween";

const allowedNetworks = [
  { title: "E-mail", description: "contact", icon: faEnvelope },
  { title: "Youtube", description: "channel", icon: faYoutube },
  { title: "Telegram", description: "contact", icon: faTelegram },
  { title: "Reddit", description: "social network", icon: faReddit },
  { title: "Twitch", description: "channel", icon: faTwitch },
  { title: "Tiktok", description: "social network", icon: faTiktok },
  { title: "Soundcloud", description: "music", icon: faSoundcloud },
  { title: "Discord", description: "contact", icon: faDiscord },
];

const SocialNetworks = ({
  isOneself,
  isUserLoading,
  isProfileBeingEdited,
  socials,
  onProfilesChange,
}) => {
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [profileLink, setProfileLink] = useState("");
  const [isProfileInputsActive, setIsProfileInputsActive] = useState(false);
  const [userProfiles, setUserProfiles] = useState([]);

  const { palette } = useTheme();
  const { text } = palette.custom;

  const handleProfileInputsActivation = () => {
    setIsProfileInputsActive((prevState) => !prevState);
  };

  const clearProfileInputs = () => {
    setSelectedNetwork("");
    setProfileLink("");
    setIsProfileInputsActive(false);
  };

  const handelSelectChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedNetwork(value);
  };

  const handleProfileAddition = () => {
    const networkAlreadyExists = userProfiles.find(
      (profile) => profile.title === selectedNetwork
    );
    if (networkAlreadyExists) {
      console.log("chosen network already was added");
      return;
    }
    if (profileLink.length === 0) return;
    const newProfile = allowedNetworks.find(
      (item) => item.title === selectedNetwork
    );
    const profiles = userProfiles;
    profiles.push({
      title: newProfile.title,
      description: newProfile.description,
      icon: newProfile.icon,
      link: profileLink,
    });
    setUserProfiles(profiles);
    onProfilesChange(userProfiles);
    clearProfileInputs();
  };

  const handleProfileRemoval = (removeableProfile) => {
    const updatedUserProfiles = userProfiles.filter(
      (profile) => profile.title !== removeableProfile
    );
    setUserProfiles(updatedUserProfiles);
    onProfilesChange(updatedUserProfiles);
  };

  useMemo(() => {
    setUserProfiles(socials);
  }, [socials]);

  useEffect(() => {
    clearProfileInputs();
  }, [isProfileBeingEdited]);

  return (
    <Box p="1rem 0 0" color={text}>
      <Typography fontSize="1rem" fontWeight="500">
        Social Profiles
      </Typography>
      {userProfiles.length === 0 && !isUserLoading && (
        <Typography textAlign="center" marginBottom="1rem" mt="1rem">
          Profiles not found...
        </Typography>
      )}
      <SkeletonLoad loading={isUserLoading} height="1.75rem">
        {userProfiles.map((profile) => (
          <FlexBetween key={profile.title} gap="1rem" margin="1rem 0">
            <a
              href={profile.link}
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <FlexBetween gap="1rem">
                <FontAwesomeIcon icon={profile.icon} size="xl" />
                <Box>
                  <Typography fontWeight="500">{profile.title}</Typography>
                  <Typography>{profile.description}</Typography>
                </Box>
              </FlexBetween>
            </a>
            {isProfileBeingEdited && isOneself && (
              <IconButton onClick={() => handleProfileRemoval(profile.title)}>
                <Delete sx={{ color: text }} />
              </IconButton>
            )}
          </FlexBetween>
        ))}
      </SkeletonLoad>
      {isProfileBeingEdited && (
        <Box>
          {isProfileInputsActive && (
            <>
              <FormControl fullWidth>
                <InputLabel id="network-select-label">Network</InputLabel>
                <Select
                  labelId="network-select-label"
                  id="network-select"
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                  onChange={handelSelectChange}
                  value={selectedNetwork}
                  label="Network"
                  SelectDisplayProps={{
                    style: {
                      display: "flex",
                      alignItems: "center",
                      padding: "1rem",
                    },
                  }}
                >
                  {allowedNetworks.map((network, index) => (
                    <MenuItem key={index} value={network.title}>
                      <FontAwesomeIcon
                        color={text}
                        icon={network.icon}
                        size="xl"
                        width="2.5rem"
                      />
                      <Typography color={text} p="0 0.5rem">
                        {network.title}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ marginTop: "1rem" }}>
                <InputLabel htmlFor="component-outlined">
                  Profile URL
                </InputLabel>
                <OutlinedInput
                  value={profileLink}
                  onChange={(e) => setProfileLink(e.target.value)}
                  id="component-outlined"
                  label="Profile link"
                />
              </FormControl>
            </>
          )}
          <Box paddingTop="0.5rem" display="flex" justifyContent="center">
            {isProfileInputsActive && (
              <IconButton sx={{ color: text }} onClick={clearProfileInputs}>
                <CancelOutlined />
              </IconButton>
            )}
            {isProfileInputsActive ? (
              <>
                <IconButton
                  sx={{ color: text }}
                  onClick={handleProfileAddition}
                >
                  <BookmarkBorderOutlined />
                </IconButton>
              </>
            ) : (
              <IconButton
                sx={{ color: text }}
                onClick={handleProfileInputsActivation}
              >
                <AddCircleOutline />
              </IconButton>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SocialNetworks;
