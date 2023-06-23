/**
 * UserInputSettings component.
 *
 * Site Kit by Google, Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { useInstanceId as useInstanceID } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import BannerNotification from './BannerNotification';
import { getTimeInSeconds } from '../../util';
import { CORE_USER } from '../../googlesitekit/datastore/user/constants';
import { CORE_SITE } from '../../googlesitekit/datastore/site/constants';
import { CORE_MODULES } from '../../googlesitekit/modules/datastore/constants';
import { MODULES_ANALYTICS } from '../../modules/analytics/datastore/constants';
import { MODULES_ANALYTICS_4 } from '../../modules/analytics-4/datastore/constants';
import { MODULES_SEARCH_CONSOLE } from '../../modules/search-console/datastore/constants';
import Link from '../Link';
const { useSelect } = Data;

export default function UserInputSettings( {
	onCTAClick,
	onView,
	onDismiss,
	isDismissible,
	rounded = false,
} ) {
	const instanceID = useInstanceID( UserInputSettings );
	const ctaLink = useSelect( ( select ) =>
		select( CORE_SITE ).getAdminURL( 'googlesitekit-user-input' )
	);
	const isUserInputCompleted = useSelect( ( select ) =>
		select( CORE_USER ).isUserInputCompleted()
	);

	const searchConsoleModuleConnected = useSelect( ( select ) =>
		select( CORE_MODULES ).isModuleConnected( 'search-console' )
	);
	const searchConsoleIsGatheringData = useSelect(
		( select ) =>
			searchConsoleModuleConnected &&
			select( MODULES_SEARCH_CONSOLE ).isGatheringData()
	);

	const analyticsModuleConnected = useSelect(
		( select ) =>
			select( CORE_MODULES ).isModuleConnected( 'analytics-4' ) ||
			select( CORE_MODULES ).isModuleConnected( 'analytics' )
	);
	const analyticsIsGatheringData = useSelect( ( select ) => {
		if ( select( CORE_MODULES ).isModuleConnected( 'analytics-4' ) ) {
			return select( MODULES_ANALYTICS_4 ).isGatheringData();
		}

		if ( select( CORE_MODULES ).isModuleConnected( 'analytics' ) ) {
			return select( MODULES_ANALYTICS ).isGatheringData();
		}

		return false;
	} );

	if ( isUserInputCompleted === undefined || isUserInputCompleted ) {
		return null;
	}

	if ( ! analyticsModuleConnected || ! searchConsoleModuleConnected ) {
		return null;
	}

	// Don't show the component if either module is gathering data, or
	// if the gathering data state is still loading/resolving.
	if (
		analyticsIsGatheringData === undefined ||
		analyticsIsGatheringData === true ||
		searchConsoleIsGatheringData === undefined ||
		searchConsoleIsGatheringData === true
	) {
		return null;
	}

	return (
		<BannerNotification
			id={ `user-input-settings-notification-${ instanceID }` }
			className="googlesitekit-user-input__notification"
			title={ __( 'Key metrics', 'google-site-kit' ) }
			description={ __(
				'Answer 3 quick questions to help us show the most relevant data for your site',
				'google-site-kit'
			) }
			format="large"
			dismissExpires={ getTimeInSeconds( 'hour' ) * 3 }
			ctaComponent={
				<Link href={ ctaLink } onClick={ onCTAClick }>
					{ __( 'Personalize your metrics', 'google-site-kit' ) }
				</Link>
			}
			dismiss={ __( 'Remind me later', 'google-site-kit' ) }
			isDismissible={ isDismissible }
			onView={ onView }
			onDismiss={ onDismiss }
			rounded={ rounded }
		/>
	);
}

UserInputSettings.propTypes = {
	// Used to bypass link functionality within Storybook to avoid breakage.
	onCTAClick: PropTypes.func,
	onView: PropTypes.func,
	onDismiss: PropTypes.func,
	isDismissible: PropTypes.bool,
	rounded: PropTypes.bool,
};
