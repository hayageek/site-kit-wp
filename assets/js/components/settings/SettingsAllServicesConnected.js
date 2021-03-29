/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Notification from '../legacy-notifications/notification';
import ThumbsUpSVG from '../../../svg/thumbs-up.svg';

export default function SettingsAllServicesConnected() {
	return (
		<Notification
			id="no-more-modules"
			title={ __( 'Congrats, you’ve connected all services!', 'google-site-kit' ) }
			description={ __( 'We’re working on adding new services to Site Kit by Google all the time, so please check back in the future.', 'google-site-kit' ) }
			format="small"
			SmallImageSVG={ ThumbsUpSVG }
			type="win-success"
		/>
	);
}
