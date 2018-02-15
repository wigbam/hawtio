/// <reference path="./login/login.module.ts"/>

namespace ConsoleAssembly {

  const pluginName = 'hawtio-console-assembly';

  angular
    .module(pluginName, [
      Login.loginModule
    ])
    .run(refreshUserSessionWhenLocationChanges)
    .run(addLogoutToUserDropdown)
    .config(overrideAuthService);

  function refreshUserSessionWhenLocationChanges($rootScope, $http: ng.IHttpService): void {
    'ngInject';
    $rootScope.$on('$locationChangeStart', ($event, newUrl, oldUrl) => {
      $http({
        method: 'post',
        url: 'refresh'
      }).then((response) => {
        log.debug("Updated session. Response:", response);
      }).catch((response) => {
        log.debug("Failed to update session expiry. Response:", response);
      });
    });
  }

  function addLogoutToUserDropdown(HawtioExtension: Core.HawtioExtension): void {
    'ngInject';
    HawtioExtension.add('hawtio-user', ($scope) => {
      const a = document.createElement('a');
      a.setAttribute('href', 'auth/logout');
      a.setAttribute('target', '_self');
      a.textContent = 'Logout';
      const li = document.createElement('li');
      li.appendChild(a);
      return li;
    });
  }

  function overrideAuthService($provide: ng.auto.IProvideService): void {
    'ngInject';
    $provide.decorator('authService', [
      '$delegate',
      function authServiceDecorator($delegate): Core.AuthService {
        return {
          logout(): void {
            $delegate.logout();
            window.location.href = 'auth/logout';
          }
        };
      }
    ]);
  }

  hawtioPluginLoader.addModule(pluginName);

}
