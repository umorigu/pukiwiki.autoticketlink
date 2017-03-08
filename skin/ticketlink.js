// ticketlink.js
if (window.addEventListener && Array.prototype.indexOf
  && document.createDocumentFragment) {
  window.addEventListener('DOMContentLoaded', function() {
    function ticketToUrl(keyText) {
      var siteList = getSiteList();
      for (var i = 0; i < siteList.length; i++) {
        var site = siteList[i];
        var m = keyText.match(site.re);
        if (m) {
          return site.baseUrl + m[3];
        }
      }
      return '';
    }
    function getSiteList() {
      var list = [
        {
          name: 'ASF JIRA',
          type: 'jira',
          re: /([\s\b]|^)(asfjira):([A-Z][A-Z0-9]+-\d+)\b/,
          baseUrl: 'https://issues.apache.org/jira/browse/'
        },
        {
          name: 'Redmime',
          type: 'redmine',
          re: /([\s\b]|^)(bug):(\d+)\b/,
          baseUrl: 'http://pukiwiki.osdn.jp/dev/?BugTrack/'
        }
      ];
      return list;
    }
    function getRegex(list) {
      return /([\s\b]|^)((asfjira):([A-Z][A-Z0-9]+-\d+)|(bug):(\d+))\b/;
      var reText = '';
      for (var i = 0, length = list.length; i < length; i++) {
        if (reText.length > 0) {
          reText += '|'
        }
        reText += list[i].re;
      }
      //                head
      return new RegExp('([\s\<\>]|^)' + reText);
    }
    function makeTicketLink(element) {
      var siteList = getSiteList();
      var re = getRegex(siteList);
      var f, m, text = element.nodeValue;
      while (m = text.match(re)) {
        // m[1]: head, m[2]: UNC path
        f || (f = document.createDocumentFragment());
        if (m.index > 0 || m[1].length > 0) {
          f.appendChild(document.createTextNode(text.substr(0, m.index) + m[1]));
        }
        var a = document.createElement('a');
        a.textContent = m[2];
        a.href = ticketToUrl(a.textContent);
        f.appendChild(a);
        text = text.substr(m.index + m[0].length);
      }
      if (f) {
        text.length > 0 && f.appendChild(document.createTextNode(text));
        element.parentNode.replaceChild(f, element)
      }
    }
    var ignoreTags = ['A', 'INPUT', 'TEXTAREA', 'BUTTON',
      'SCRIPT', 'FRAME', 'IFRAME'];
    function walkElement(element) {
      var e = element.firstChild;
      while (e) {
        if (e.nodeType == 3 && e.nodeValue.length > 5 && /\S/.test(e.nodeValue)) {
          var next = e.nextSibling;
          makeTicketLink(e);
          e = next;
        } else {
          if (e.nodeType == 1 && ignoreTags.indexOf(e.tagName) == -1) {
            walkElement(e);
          }
          e = e.nextSibling;
        }
      }
    }
    var target = document.getElementById('body');
    walkElement(target);
  });
}
